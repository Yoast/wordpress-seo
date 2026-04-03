<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

use InvalidArgumentException;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Client_Authentication_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Grant_Strategy_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Authenticator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Central handler for OAuth token endpoint requests.
 *
 * Handles client authentication (private_key_jwt) and delegates grant-specific
 * parameters to the provided Grant_Strategy_Interface. Executes the token request via
 * the token endpoint client and handles error responses.
 */
class OAuth_Grant_Handler {

	/**
	 * The discovery port.
	 *
	 * @var Discovery_Interface
	 */
	private $discovery;

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * The client authenticator port.
	 *
	 * @var Client_Authenticator_Interface
	 */
	private $client_authenticator;

	/**
	 * The token endpoint client port.
	 *
	 * @var OAuth_Server_Client_Interface
	 */
	private $oauth_server_client;

	/**
	 * OAuth_Grant_Handler constructor.
	 *
	 * @param Discovery_Interface            $discovery            The discovery port.
	 * @param Client_Registration_Interface  $client_registration  The client registration port.
	 * @param Client_Authenticator_Interface $client_authenticator The client authenticator port.
	 * @param OAuth_Server_Client_Interface  $oauth_server_client  The token endpoint client port.
	 */
	public function __construct(
		Discovery_Interface $discovery,
		Client_Registration_Interface $client_registration,
		Client_Authenticator_Interface $client_authenticator,
		OAuth_Server_Client_Interface $oauth_server_client
	) {
		$this->discovery            = $discovery;
		$this->client_registration  = $client_registration;
		$this->client_authenticator = $client_authenticator;
		$this->oauth_server_client  = $oauth_server_client;
	}

	/**
	 * Executes a token endpoint request using the provided grant strategy.
	 *
	 * Ensures the client is registered, creates a client assertion, merges
	 * grant-specific parameters, and sends the request.
	 *
	 * @param Grant_Strategy_Interface $grant The grant strategy providing grant-specific parameters.
	 *
	 * @return Token_Set The token set from the response.
	 *
	 * @throws Token_Request_Failed_Exception If the token request fails.
	 */
	public function request_token( Grant_Strategy_Interface $grant ): Token_Set {
		$registered_client = $this->client_registration->ensure_registered();

		try {
			$token_endpoint = $this->discovery->get_document()->get_token_endpoint();
		} catch ( Discovery_Failed_Exception | Server_Capability_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'discovery_failed', $e->getMessage(), 0, $e );
		}

		$client_id = $registered_client->get_client_id();

		try {
			$client_assertion = $this->client_authenticator->create_client_assertion( $client_id, $token_endpoint );
		} catch ( Client_Authentication_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'client_authentication_failed', $e->getMessage(), 0, $e );
		}

		$body = \array_merge(
			[
				'grant_type'            => $grant->get_grant_type(),
				'client_id'             => $client_id,
				'client_assertion_type' => 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
				'client_assertion'      => $client_assertion,
			],
			$grant->get_grant_params(),
		);

		$result = $this->oauth_server_client->request(
			'POST',
			$token_endpoint,
			[
				'headers' => [ 'Content-Type' => 'application/x-www-form-urlencoded' ],
				'body'    => $body,
				'dpop'    => true,
			],
		);

		if ( $result['status'] < 200 || $result['status'] >= 300 ) {
			if ( \is_array( $result['body'] ) && isset( $result['body']['error'] ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				throw Token_Request_Failed_Exception::from_response( $result['body'], $result['status'] );
			}
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'token_request_failed', 'HTTP ' . $result['status'], $result['status'] );
		}

		try {
			return Token_Set::from_response( $result['body'] );
		} catch ( InvalidArgumentException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'invalid_token_response', $e->getMessage(), 0, $e );
		}
	}
}
