<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Exception;
use SensitiveParameter;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Authenticator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Revokes tokens at the authorization server (RFC 7009).
 *
 * Token revocation is best-effort — failures are silently ignored.
 */
class Token_Revocation_Handler implements LoggerAwareInterface {
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
	 * Token_Revocation_Handler constructor.
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
	 * Revokes a token at the authorization server.
	 *
	 * @param string $token           The token to revoke.
	 * @param string $token_type_hint The token type hint ("refresh_token" or "access_token").
	 *
	 * @return bool True if the revocation request was sent (regardless of server response).
	 */
	public function revoke(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $token,
		string $token_type_hint = 'refresh_token'
	): bool {
		try {
			$registered_client = $this->client_registration->get_registered_client();
			if ( $registered_client === null ) {
				return false;
			}
			$revocation_endpoint = $this->discovery->get_document()->get_revocation_endpoint();

			$client_assertion = $this->client_authenticator->create_client_assertion(
				$registered_client->get_client_id(),
				$revocation_endpoint,
			);

			$body = [
				'token'                 => $token,
				'token_type_hint'       => $token_type_hint,
				'client_id'             => $registered_client->get_client_id(),
				'client_assertion_type' => 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
				'client_assertion'      => $client_assertion,
			];

			$this->oauth_server_client->request(
				'POST',
				$revocation_endpoint,
				[
					'headers' => [ 'Content-Type' => 'application/x-www-form-urlencoded' ],
					'body'    => $body,
					'dpop'    => true,
				],
			);

			return true;
		}
		catch ( Exception $e ) {
			$this->logger->warning(
				'Token revocation failed ({token_type_hint}): {error}',
				[
					'token_type_hint' => $token_type_hint,
					'error'           => $e->getMessage(),
				],
			);
			return false;
		}
	}
}
