<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

use InvalidArgumentException;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Client_Authentication_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Grant_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Authenticator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Central handler for OAuth token endpoint requests.
 *
 * Handles client authentication (private_key_jwt) and delegates grant-specific
 * parameters to the provided Grant_Interface. Executes the token request via
 * the token endpoint client and handles error responses.
 */
class OAuth_Grant_Handler implements LoggerAwareInterface {
	use LoggerAwareTrait;

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
		$this->logger               = new NullLogger();
	}

	/**
	 * Executes a token endpoint request using the provided grant strategy.
	 *
	 * Ensures the client is registered, creates a client assertion, merges
	 * grant-specific parameters, and sends the request.
	 *
	 * @param Grant_Interface $grant The grant strategy providing grant-specific parameters.
	 *
	 * @return Token_Set The token set from the response.
	 *
	 * @throws Token_Request_Failed_Exception If the token request fails.
	 */
	public function request_token( Grant_Interface $grant ): Token_Set {
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

		if ( ! $result->is_successful() ) {
			$error       = (string) $result->get_body_value( 'error', 'unknown' );
			$description = (string) $result->get_body_value( 'error_description', '' );
			$this->logger->warning(
				'Token request failed for grant {grant_type}: HTTP {status}, error={error} {description}',
				[
					'grant_type'  => $grant->get_grant_type(),
					'status'      => $result->get_status(),
					'error'       => $error,
					'description' => $description,
				],
			);

			$body = $result->get_body();
			if ( \is_array( $body ) && isset( $body['error'] ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				throw Token_Request_Failed_Exception::from_response( $body, $result->get_status() );
			}
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'token_request_failed', 'HTTP ' . $result->get_status(), $result->get_status() );
		}

		$body = $result->get_body();
		if ( ! \is_array( $body ) ) {
			throw new Token_Request_Failed_Exception( 'invalid_token_response', 'Token endpoint did not return a JSON object.' );
		}

		try {
			return Token_Set::from_response( $body );
		} catch ( InvalidArgumentException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Request_Failed_Exception( 'invalid_token_response', $e->getMessage(), 0, $e );
		}
	}
}
