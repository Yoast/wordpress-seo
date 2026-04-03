<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Client_Credentials_Grant;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Site_URL_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Primary facade for the MyYoast OAuth client.
 *
 * Orchestrates registration, token lifecycle, and authenticated requests.
 * This is the main entry point for consuming code.
 */
class MyYoast_Client {

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * The OAuth grant handler.
	 *
	 * @var OAuth_Grant_Handler
	 */
	private $grant_handler;

	/**
	 * The OAuth server client port.
	 *
	 * @var OAuth_Server_Client_Interface
	 */
	private $http_client;

	/**
	 * The site-level token storage port.
	 *
	 * @var Token_Storage_Interface
	 */
	private $token_storage;

	/**
	 * The site URL provider port.
	 *
	 * @var Site_URL_Provider_Interface
	 */
	private $site_url_provider;

	/**
	 * MyYoast_Client constructor.
	 *
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 * @param OAuth_Grant_Handler           $grant_handler       The OAuth grant handler.
	 * @param OAuth_Server_Client_Interface $http_client         The OAuth server client port.
	 * @param Token_Storage_Interface       $token_storage       The site-level token storage port.
	 * @param Site_URL_Provider_Interface   $site_url_provider   The site URL provider port.
	 */
	public function __construct(
		Client_Registration_Interface $client_registration,
		OAuth_Grant_Handler $grant_handler,
		OAuth_Server_Client_Interface $http_client,
		Token_Storage_Interface $token_storage,
		Site_URL_Provider_Interface $site_url_provider
	) {
		$this->client_registration = $client_registration;
		$this->grant_handler       = $grant_handler;
		$this->http_client         = $http_client;
		$this->token_storage       = $token_storage;
		$this->site_url_provider   = $site_url_provider;
	}

	/**
	 * Ensures the plugin is registered as an OAuth client.
	 *
	 * @param string[] $redirect_uris The OAuth redirect URIs to register with.
	 *
	 * @return Registered_Client The registered client.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	public function ensure_registered( array $redirect_uris = [] ): Registered_Client {
		return $this->client_registration->ensure_registered( $redirect_uris );
	}

	/**
	 * Whether the plugin is registered as an OAuth client.
	 *
	 * @param string[] $redirect_uris Optional redirect URIs to verify against the stored registration.
	 *
	 * @return bool
	 */
	public function is_registered( array $redirect_uris = [] ): bool {
		return $this->client_registration->is_registered( $redirect_uris );
	}

	/**
	 * Reads the current client registration from the server.
	 *
	 * @return array<string, string|string[]> The registration metadata.
	 *
	 * @throws Registration_Failed_Exception If the read fails.
	 */
	public function verify_registration(): array {
		return $this->client_registration->read_registration();
	}

	/**
	 * Deletes the client registration from the server and clears local data.
	 *
	 * @return bool True if deleted or not registered, false on network failure.
	 */
	public function deregister(): bool {
		return $this->client_registration->deregister();
	}

	/**
	 * Rotates the registration key pair.
	 *
	 * @return Registered_Client The updated credentials.
	 *
	 * @throws Registration_Failed_Exception If the rotation fails.
	 */
	public function rotate_registration_keys(): Registered_Client {
		return $this->client_registration->rotate_registration_keys();
	}

	/**
	 * Rotates the DPoP key pair.
	 *
	 * @return void
	 */
	public function rotate_dpop_keys(): void {
		$this->client_registration->rotate_dpop_keys();
	}

	/**
	 * Returns a valid site-level access token (client_credentials).
	 *
	 * @param string[] $scopes The service:* scopes to request.
	 *
	 * @return Token_Set The site-level token set.
	 *
	 * @throws Token_Request_Failed_Exception If the token request fails.
	 * @throws Token_Storage_Exception        If encrypting the token set for storage fails.
	 */
	public function get_site_token( array $scopes = [] ): Token_Set {
		$cached = $this->token_storage->get();
		if ( $cached !== null && ! $cached->is_expired() && $cached->has_scopes( $scopes ) ) {
			return $cached;
		}

		$grant     = new Client_Credentials_Grant( $scopes, $this->site_url_provider->get() );
		$token_set = $this->grant_handler->request_token( $grant );
		$this->token_storage->store( $token_set );

		return $token_set;
	}

	/**
	 * Clears the site-level token.
	 *
	 * @return void
	 */
	public function clear_site_token(): void {
		$this->token_storage->delete();
	}

	/**
	 * Makes an authenticated DPoP-bound request to a resource server.
	 *
	 * @param string                         $method    The HTTP method.
	 * @param string                         $url       The resource URL.
	 * @param Token_Set                      $token_set The token set to use.
	 * @param array<string, string|int|bool> $options   Additional request options.
	 *
	 * @return array{status: int, headers: array<string, string>, body: array<string, string|int>|string} The response.
	 */
	public function authenticated_request( string $method, string $url, Token_Set $token_set, array $options = [] ): array {
		return $this->http_client->authenticated_request(
			$method,
			$url,
			$token_set->get_access_token(),
			$token_set->get_token_type(),
			$options,
		);
	}
}
