<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Application;

use SensitiveParameter;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Authorization_Flow_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Client_Credentials_Grant;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Refresh_Token_Grant;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Site_URL_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Type_Hint;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Primary facade for the MyYoast OAuth client.
 *
 * Orchestrates registration, token lifecycle, and authenticated requests.
 * This is the main entry point for consuming code.
 */
class MyYoast_Client implements LoggerAwareInterface {
	use LoggerAwareTrait;

	private const REFRESH_LOCK_TTL_IN_SECONDS = 30;

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * The authorization code handler.
	 *
	 * @var Authorization_Code_Handler
	 */
	private $auth_code_handler;

	/**
	 * The OAuth grant handler.
	 *
	 * @var OAuth_Grant_Handler
	 */
	private $grant_handler;

	/**
	 * The token revocation handler.
	 *
	 * @var Token_Revocation_Handler
	 */
	private $revocation_handler;

	/**
	 * The OAuth server client port.
	 *
	 * @var OAuth_Server_Client_Interface
	 */
	private $http_client;

	/**
	 * The lock helper.
	 *
	 * @var Lock_Helper
	 */
	private $lock_helper;

	/**
	 * The site-level token storage port.
	 *
	 * @var Token_Storage_Interface
	 */
	private $token_storage;

	/**
	 * The user-level token storage port.
	 *
	 * @var User_Token_Storage_Interface
	 */
	private $user_token_storage;

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
	 * @param Authorization_Code_Handler    $auth_code_handler   The authorization code handler.
	 * @param OAuth_Grant_Handler           $grant_handler       The OAuth grant handler.
	 * @param Token_Revocation_Handler      $revocation_handler  The token revocation handler.
	 * @param OAuth_Server_Client_Interface $http_client         The OAuth server client port.
	 * @param Lock_Helper                   $lock_helper         The lock helper.
	 * @param Token_Storage_Interface       $token_storage       The site-level token storage port.
	 * @param User_Token_Storage_Interface  $user_token_storage  The user-level token storage port.
	 * @param Site_URL_Provider_Interface   $site_url_provider   The site URL provider port.
	 */
	public function __construct(
		Client_Registration_Interface $client_registration,
		Authorization_Code_Handler $auth_code_handler,
		OAuth_Grant_Handler $grant_handler,
		Token_Revocation_Handler $revocation_handler,
		OAuth_Server_Client_Interface $http_client,
		Lock_Helper $lock_helper,
		Token_Storage_Interface $token_storage,
		User_Token_Storage_Interface $user_token_storage,
		Site_URL_Provider_Interface $site_url_provider
	) {
		$this->client_registration = $client_registration;
		$this->auth_code_handler   = $auth_code_handler;
		$this->grant_handler       = $grant_handler;
		$this->revocation_handler  = $revocation_handler;
		$this->http_client         = $http_client;
		$this->lock_helper         = $lock_helper;
		$this->token_storage       = $token_storage;
		$this->user_token_storage  = $user_token_storage;
		$this->site_url_provider   = $site_url_provider;
		$this->logger              = new NullLogger();
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
	 * Builds the authorization URL for the user authorization flow.
	 *
	 * @param int         $user_id      The WordPress user ID.
	 * @param string      $redirect_uri The callback redirect URI.
	 * @param string[]    $scopes       The scopes to request.
	 * @param string|null $return_url   The URL to return the user to after authorization completes.
	 *
	 * @return string The authorization URL.
	 *
	 * @throws Authorization_Flow_Exception If registration, discovery, or parameter validation fails.
	 */
	public function get_authorization_url( int $user_id, string $redirect_uri, array $scopes = [], ?string $return_url = null ): string {
		return $this->auth_code_handler->get_authorization_url( $user_id, $redirect_uri, $scopes, $return_url );
	}

	/**
	 * Exchanges an authorization code for tokens and stores them for the user.
	 *
	 * @param int    $user_id The WordPress user ID.
	 * @param string $code    The authorization code.
	 * @param string $state   The state parameter from the callback.
	 *
	 * @return Token_Set The obtained tokens.
	 *
	 * @throws Token_Request_Failed_Exception If the exchange fails.
	 * @throws Token_Storage_Exception        If encrypting the token set for storage fails.
	 */
	public function exchange_authorization_code( int $user_id, string $code, string $state ): Token_Set {
		$token_set = $this->auth_code_handler->exchange_code( $user_id, $code, $state );
		$this->user_token_storage->store( $user_id, $token_set );
		return $token_set;
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
	 * Returns a valid user-level access token, auto-refreshing if expired.
	 *
	 * @param int      $user_id         The WordPress user ID.
	 * @param string[] $required_scopes Optional scopes required for the token; if provided, no token will be returned unless it has at least these scopes.
	 *                                  This is to avoid refreshing a token that would trigger an immediate re-authorization due to missing scopes.
	 *
	 * @return Token_Set|null The user token set, or null if the user hasn't authorized.
	 */
	public function get_user_token( int $user_id, array $required_scopes = [] ): ?Token_Set {
		$token_set = $this->user_token_storage->get( $user_id );
		if ( $token_set === null ) {
			return null;
		}

		if ( ! $token_set->has_scopes( $required_scopes ) ) {
			// Required scopes are missing, treat as if no token is available.
			return null;
		}

		if ( ! $token_set->is_expired() ) {
			return $token_set;
		}

		$refresh_token = $token_set->get_refresh_token();
		if ( $refresh_token === null ) {
			return null;
		}

		try {
			// If the client was just re-registered, this refresh will fail with invalid_grant.
			// error_count is 0 on first attempt; after one invalid_grant it becomes 1.
			// On the second consecutive invalid_grant (error_count >= 1), clear and give up.
			$grant         = new Refresh_Token_Grant( $refresh_token );
			$lock_key      = 'wpseo_myyoast_refresh:' . \hash( 'sha256', $refresh_token );
			$new_token_set = $this->lock_helper->execute(
				$lock_key,
				function () use ( $grant ) {
					return $this->grant_handler->request_token( $grant );
				},
				self::REFRESH_LOCK_TTL_IN_SECONDS,
			);
			try {
				$this->user_token_storage->store( $user_id, $new_token_set );
			} catch ( Token_Storage_Exception $e ) {
				// Next request will re-refresh from the old stored token.
				$this->logger->warning( 'Failed to persist refreshed token: {error}', [ 'error' => $e->getMessage() ] );
			}
			return $new_token_set;
		} catch ( Lock_Timeout_Exception $e ) {
			// Concurrent refresh in progress, treat as transient failure.
			$this->logger->debug( 'Skipping token refresh for user {user_id}: concurrent refresh in progress.', [ 'user_id' => $user_id ] );
			return null;
		} catch ( Token_Request_Failed_Exception $e ) {
			if ( $e->get_error_code() === 'invalid_grant' ) {
				if ( $token_set->get_error_count() >= 1 ) {
					$this->logger->warning( 'Repeated invalid_grant for user {user_id}, clearing stored tokens.', [ 'user_id' => $user_id ] );
					$this->user_token_storage->delete( $user_id );
					return null;
				}

				try {
					$this->user_token_storage->store( $user_id, $token_set->with_incremented_error_count() );
				} catch ( Token_Storage_Exception $e ) {
					// Failure to persist error count is non-critical; token will be retried next request.
					$this->logger->warning( 'Failed to persist token error count: {error}', [ 'error' => $e->getMessage() ] );
				}
			}

			return null;
		}
	}

	/**
	 * Whether the given user has authorized with MyYoast.
	 *
	 * @param int $user_id The WordPress user ID.
	 *
	 * @return bool
	 */
	public function has_user_token( int $user_id ): bool {
		return $this->user_token_storage->get( $user_id ) !== null;
	}

	/**
	 * Revokes the user's tokens and clears storage.
	 *
	 * @param int $user_id The WordPress user ID.
	 *
	 * @return void
	 */
	public function revoke_user_token( int $user_id ): void {
		$token_set = $this->user_token_storage->get( $user_id );
		if ( $token_set === null ) {
			return;
		}
		// Assume tokens are opaque for forwards compatibility. This operation is noop for JWTs, as they are only revoked upon expiration.
		$this->revocation_handler->revoke( $token_set->get_access_token(), Token_Type_Hint::ACCESS_TOKEN );
		if ( $token_set->get_refresh_token() !== null ) {
			$this->revocation_handler->revoke( $token_set->get_refresh_token(), Token_Type_Hint::REFRESH_TOKEN );
		}

		$this->user_token_storage->delete( $user_id );
	}

	/**
	 * Revokes a token at the authorization server.
	 *
	 * @param string $token           The token to revoke.
	 * @param string $token_type_hint A Token_Type_Hint constant.
	 *
	 * @return bool True if the revocation request was sent.
	 */
	public function revoke_token(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $token,
		string $token_type_hint = Token_Type_Hint::REFRESH_TOKEN
	): bool {
		return $this->revocation_handler->revoke( $token, $token_type_hint );
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
	 * @return HTTP_Response The response.
	 */
	public function authenticated_request( string $method, string $url, Token_Set $token_set, array $options = [] ): HTTP_Response {
		return $this->http_client->authenticated_request(
			$method,
			$url,
			$token_set->get_access_token(),
			$token_set->get_token_type(),
			$options,
		);
	}
}
