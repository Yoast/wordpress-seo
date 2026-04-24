<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Registration;

use InvalidArgumentException;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Token_Type;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Discovery_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Manages the full OAuth client registration lifecycle (RFC 7591 + RFC 7592).
 *
 * Handles initial Dynamic Client Registration, credential storage, key rotation,
 * registration verification, and deregistration. Each WordPress site (or subsite
 * in multisite) registers its own client_id. Uses lazy registration with a
 * database-backed exclusive lock.
 */
class Client_Registration implements Client_Registration_Interface, LoggerAwareInterface {
	use LoggerAwareTrait;

	private const OPTION_KEY_PREFIX       = 'wpseo_myyoast_client_registration_';
	private const ENCRYPTION_CONTEXT      = 'yoast-myyoast-registration-credentials';
	private const DCR_LOCK_TTL_IN_SECONDS = \MINUTE_IN_SECONDS;

	/**
	 * The discovery client.
	 *
	 * @var Discovery_Client
	 */
	private $discovery_client;

	/**
	 * The key pair manager.
	 *
	 * @var Key_Pair_Manager
	 */
	private $key_pair_manager;

	/**
	 * The encryption service.
	 *
	 * @var Encryption
	 */
	private $encryption;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * The lock helper.
	 *
	 * @var Lock_Helper
	 */
	private $lock_helper;

	/**
	 * The HTTP client.
	 *
	 * @var HTTP_Client
	 */
	private $http_client;

	/**
	 * In-memory cache for registered clients, keyed by option key (avoids repeated decryption within a single request).
	 *
	 * Each entry is Registered_Client|null (null = checked but not registered).
	 * Absence of a key means not yet loaded.
	 *
	 * @var array<string, Registered_Client|null>
	 */
	private $cached_registered_clients = [];

	/**
	 * Client_Registration constructor.
	 *
	 * @param Discovery_Client $discovery_client The discovery client.
	 * @param Key_Pair_Manager $key_pair_manager The key pair manager.
	 * @param Encryption       $encryption       The encryption service.
	 * @param Issuer_Config    $issuer_config    The issuer configuration.
	 * @param Lock_Helper      $lock_helper      The lock helper.
	 * @param HTTP_Client      $http_client      The HTTP client.
	 */
	public function __construct(
		Discovery_Client $discovery_client,
		Key_Pair_Manager $key_pair_manager,
		Encryption $encryption,
		Issuer_Config $issuer_config,
		Lock_Helper $lock_helper,
		HTTP_Client $http_client
	) {
		$this->discovery_client = $discovery_client;
		$this->key_pair_manager = $key_pair_manager;
		$this->encryption       = $encryption;
		$this->issuer_config    = $issuer_config;
		$this->lock_helper      = $lock_helper;
		$this->http_client      = $http_client;
		$this->logger           = new NullLogger();
	}

	/**
	 * Registers the plugin as an OAuth client via DCR (RFC 7591).
	 *
	 * Uses a database-backed exclusive lock to prevent concurrent registrations.
	 *
	 * @param string[] $redirect_uris The OAuth redirect URIs to register.
	 *
	 * @return Registered_Client The registration result.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	public function register( array $redirect_uris ): Registered_Client {
		// Acquire lock and execute registration.
		try {
			return $this->lock_helper->execute(
				'wpseo_myyoast_dcr_lock:' . $this->issuer_config->get_issuer_key() . ':' . \get_current_blog_id(),
				function () use ( $redirect_uris ) {
					return $this->do_register( $redirect_uris );
				},
				self::DCR_LOCK_TTL_IN_SECONDS,
			);
		} catch ( Lock_Timeout_Exception $e ) {
			$this->logger->warning( 'DCR lock contention: another registration is already in progress.' );
			throw new Registration_Failed_Exception( 'Another registration is already in progress.' );
		}
	}

	/**
	 * Returns the stored registered client, or null if not registered.
	 *
	 * @return Registered_Client|null The registered client, or null if not registered.
	 */
	public function get_registered_client(): ?Registered_Client {
		$option_key = $this->get_option_key();

		if ( \array_key_exists( $option_key, $this->cached_registered_clients ) ) {
			return $this->cached_registered_clients[ $option_key ];
		}

		$stored = \get_option( $option_key, false );
		if ( ! \is_array( $stored ) || empty( $stored['client_id'] ) || empty( $stored['encrypted_rat'] ) ) {
			$this->cached_registered_clients[ $option_key ] = null;
			return null;
		}

		try {
			$rat = $this->encryption->decrypt( $stored['encrypted_rat'], self::ENCRYPTION_CONTEXT );
		} catch ( Encryption_Exception $e ) {
			$this->logger->error( 'Failed to decrypt registration access token, clearing registration: {error}', [ 'error' => $e->getMessage() ] );
			$this->forget_registration();
			return null;
		}

		try {
			$this->cached_registered_clients[ $option_key ] = new Registered_Client(
				$stored['client_id'],
				$rat,
				( $stored['registration_client_uri'] ?? '' ),
				( $stored['metadata'] ?? [] ),
			);
		} catch ( InvalidArgumentException $e ) {
			$this->logger->error( 'Stored registration data is invalid, clearing registration: {error}', [ 'error' => $e->getMessage() ] );
			$this->forget_registration();
			return null;
		}

		return $this->cached_registered_clients[ $option_key ];
	}

	/**
	 * Whether the plugin is registered as an OAuth client.
	 *
	 * When redirect URIs are provided, also verifies that all of them
	 * are included in the stored registration.
	 *
	 * @param string[] $redirect_uris Optional redirect URIs to verify against the stored registration.
	 *
	 * @return bool
	 */
	public function is_registered( array $redirect_uris = [] ): bool {
		$registered_client = $this->get_registered_client();
		if ( $registered_client === null ) {
			return false;
		}

		if ( $redirect_uris === [] ) {
			return true;
		}

		$stored_uris = ( $registered_client->get_metadata()['redirect_uris'] ?? [] );

		return \array_diff( $redirect_uris, $stored_uris ) === [];
	}

	/**
	 * Ensures the plugin is registered, performing DCR if needed.
	 *
	 * @param string[] $redirect_uris The OAuth redirect URIs to register with.
	 *
	 * @return Registered_Client The client credentials.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	public function ensure_registered( array $redirect_uris = [] ): Registered_Client {
		if ( $this->is_registered( $redirect_uris ) ) {
			return $this->get_registered_client();
		}

		// Registered with stale redirect URIs — deregister first.
		if ( $this->get_registered_client() !== null ) {
			$this->deregister();
		}

		if ( $redirect_uris === [] ) {
			throw new Registration_Failed_Exception( 'At least one redirect URI is required for initial registration.' );
		}

		return $this->register( $redirect_uris );
	}

	/**
	 * Reads the current client registration from the server (RFC 7592 GET).
	 *
	 * @return array<string, string|string[]> The registration metadata.
	 *
	 * @throws Registration_Failed_Exception If the read fails.
	 */
	public function read_registration(): array {
		$registered_client = $this->get_registered_client();
		if ( $registered_client === null ) {
			throw new Registration_Failed_Exception( 'Not registered.' );
		}

		$result = $this->http_client->authenticated_request(
			'GET',
			$registered_client->get_registration_client_uri(),
			$registered_client->get_registration_access_token(),
			Auth_Token_Type::BEARER,
			[
				'timeout' => 10,
				'headers' => [ 'Accept' => 'application/json' ],
			],
		);

		if ( $result->is_transport_failure() ) {
			$error_message = (string) $result->get_body_value( 'error_description', '' );
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Registration_Failed_Exception( 'Failed to read registration: ' . $error_message );
		}

		if ( $result->get_status() === 401 || $result->get_status() === 404 ) {
			$this->logger->warning( 'Registration is no longer valid (HTTP {status}), clearing local registration.', [ 'status' => $result->get_status() ] );
			$this->forget_registration();
			throw new Registration_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				'Registration is no longer valid (HTTP ' . $result->get_status() . ').',
			);
		}

		if ( ! $result->is_successful() ) {
			$error_message = (string) $result->get_body_value( 'error_description', $result->get_body_value( 'error', '' ) );
			throw new Registration_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Registration read returned HTTP %d: %s', $result->get_status(), $error_message ),
			);
		}

		$body = $result->get_body();
		if ( ! \is_array( $body ) ) {
			throw new Registration_Failed_Exception( 'Invalid response from registration endpoint.' );
		}

		return $body;
	}

	/**
	 * Rotates the registration key pair by updating the registration with a new JWKS (RFC 7592 PUT).
	 *
	 * @return Registered_Client The updated credentials (with new RAT).
	 *
	 * @throws Registration_Failed_Exception If the rotation fails.
	 */
	public function rotate_registration_keys(): Registered_Client {
		$registered_client = $this->get_registered_client();
		if ( $registered_client === null ) {
			throw new Registration_Failed_Exception( 'Not registered.' );
		}

		// Generate a new key pair in memory — only persist after server confirms.
		$new_key_pair = $this->key_pair_manager->generate_key_pair();
		$new_jwk      = $this->key_pair_manager->get_public_key_jwk( $new_key_pair );

		// Build the update request body from stored metadata with the new JWKS.
		// Per RFC 7592 §2.2, server-assigned fields MUST NOT be included.
		$request_body                       = $this->build_update_request_body( $registered_client->get_metadata() );
		$request_body['jwks']               = [ 'keys' => [ $new_jwk ] ];
		$request_body['software_statement'] = $this->issuer_config->get_software_statement();

		// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Encoding for HTTP request body, not user-facing output.
		$json = \wp_json_encode( $request_body );
		if ( $json === false ) {
			throw new Registration_Failed_Exception( 'Failed to JSON-encode registration request body.' );
		}

		$result = $this->http_client->authenticated_request(
			'PUT',
			$registered_client->get_registration_client_uri(),
			$registered_client->get_registration_access_token(),
			Auth_Token_Type::BEARER,
			[
				'headers' => [
					'Content-Type' => 'application/json',
					'Accept'       => 'application/json',
				],
				'body'    => $json,
				'timeout' => 15,
			],
		);

		if ( ! $result->is_successful() ) {
			$error_message = (string) $result->get_body_value( 'error_description', $result->get_body_value( 'error', '' ) );
			throw new Registration_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Key rotation returned HTTP %d: %s', $result->get_status(), $error_message ),
			);
		}

		$body = $result->get_body();
		if ( ! \is_array( $body ) || empty( $body['client_id'] ) ) {
			throw new Registration_Failed_Exception( 'Key rotation returned invalid response.' );
		}

		// Server confirmed — now persist the new key pair locally.
		$this->key_pair_manager->store_key_pair( Key_Pair_Manager::PURPOSE_REGISTRATION, $new_key_pair );

		// Store the new RAT atomically.
		return $this->store_credentials( $body );
	}

	/**
	 * Deletes the client registration from the server (RFC 7592 DELETE) and clears local data.
	 *
	 * @return bool True if deleted or already not registered, false on network failure.
	 */
	public function deregister(): bool {
		$credentials = $this->get_registered_client();
		if ( $credentials === null ) {
			return true;
		}

		$result = $this->http_client->authenticated_request(
			'DELETE',
			$credentials->get_registration_client_uri(),
			$credentials->get_registration_access_token(),
			Auth_Token_Type::BEARER,
			[ 'timeout' => 10 ],
		);

		$this->forget_registration();

		return ! $result->is_transport_failure();
	}

	/**
	 * Deletes the stored registration credentials.
	 *
	 * @return void
	 */
	public function forget_registration(): void {
		unset( $this->cached_registered_clients[ $this->get_option_key() ] );
		\delete_option( $this->get_option_key() );
	}

	/**
	 * Deletes all local registration data (credentials, key pairs, caches).
	 *
	 * @return void
	 */
	public function delete_local_data(): void {
		$this->forget_registration();
		$this->key_pair_manager->delete_key_pair( Key_Pair_Manager::PURPOSE_REGISTRATION );
		$this->key_pair_manager->delete_key_pair( Key_Pair_Manager::PURPOSE_DPOP );
		$this->discovery_client->invalidate_cache();
		$suffix = $this->issuer_config->get_issuer_key();
		\delete_transient( 'wpseo_myyoast_jwks_' . $suffix );
		\delete_transient( 'wpseo_myyoast_dpop_nonce_' . $suffix );
	}

	/**
	 * Rotates the DPoP key pair (local only, no server coordination).
	 *
	 * @return void
	 */
	public function rotate_dpop_keys(): void {
		$this->key_pair_manager->rotate_key_pair( Key_Pair_Manager::PURPOSE_DPOP );
	}

	/**
	 * Stores the DCR response credentials securely.
	 *
	 * @param array<string, string|array<string>> $response_body The parsed DCR response body.
	 *
	 * @return Registered_Client The stored credentials.
	 */
	private function store_credentials( array $response_body ): Registered_Client {
		$option_key    = $this->get_option_key();
		$encrypted_rat = $this->encryption->encrypt(
			( $response_body['registration_access_token'] ?? '' ),
			self::ENCRYPTION_CONTEXT,
		);

		// Strip the RAT from metadata — it is stored encrypted separately.
		$metadata = $response_body;
		unset( $metadata['registration_access_token'] );

		\update_option(
			$option_key,
			[
				'client_id'               => $response_body['client_id'],
				'encrypted_rat'           => $encrypted_rat,
				'registration_client_uri' => ( $response_body['registration_client_uri'] ?? '' ),
				'metadata'                => $metadata,
			],
			false,
		);

		$this->cached_registered_clients[ $option_key ] = new Registered_Client(
			$response_body['client_id'],
			( $response_body['registration_access_token'] ?? '' ),
			( $response_body['registration_client_uri'] ?? '' ),
			$metadata,
		);

		return $this->cached_registered_clients[ $option_key ];
	}

	/**
	 * Returns the issuer-scoped option key for storing registration data.
	 *
	 * @return string The option key.
	 */
	private function get_option_key(): string {
		return self::OPTION_KEY_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Performs the actual DCR registration request.
	 *
	 * @param string[] $redirect_uris The OAuth redirect URIs to register.
	 *
	 * @return Registered_Client The registration result.
	 *
	 * @throws Registration_Failed_Exception If registration fails.
	 */
	private function do_register( array $redirect_uris ): Registered_Client {
		try {
			$registration_endpoint = $this->discovery_client->get_document()->get_registration_endpoint();
		} catch ( Discovery_Failed_Exception | Server_Capability_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Registration_Failed_Exception( 'OIDC discovery failed: ' . $e->getMessage(), 0, $e );
		}

		$software_statement   = $this->issuer_config->get_software_statement();
		$initial_access_token = $this->issuer_config->get_initial_access_token();

		if ( $software_statement === '' || $initial_access_token === '' ) {
			throw new Registration_Failed_Exception( 'Software statement and initial access token must be configured.' );
		}

		// Ensure a registration key pair exists.
		$key_pair   = $this->key_pair_manager->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_REGISTRATION );
		$public_jwk = $this->key_pair_manager->get_public_key_jwk( $key_pair );

		$request_body = [
			'software_statement'         => $software_statement,
			'redirect_uris'              => $redirect_uris,
			'grant_types'                => [ 'authorization_code', 'refresh_token', 'client_credentials' ],
			'token_endpoint_auth_method' => 'private_key_jwt',
			'jwks'                       => [ 'keys' => [ $public_jwk ] ],
			'dpop_bound_access_tokens'   => true,
		];

		// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Encoding for HTTP request body, not user-facing output.
		$json = \wp_json_encode( $request_body );
		if ( $json === false ) {
			throw new Registration_Failed_Exception( 'Failed to JSON-encode DCR request body.' );
		}

		$result = $this->http_client->request(
			'POST',
			$registration_endpoint,
			[
				'headers' => [
					'Authorization' => 'Bearer ' . $initial_access_token,
					'Content-Type'  => 'application/json',
					'Accept'        => 'application/json',
				],
				'body'    => $json,
				'timeout' => 15,
			],
		);

		if ( $result->is_transport_failure() ) {
			$error_message = (string) $result->get_body_value( 'error_description', '' );
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Registration_Failed_Exception( 'DCR request failed: ' . $error_message );
		}

		if ( $result->get_status() !== 201 ) {
			$error_message = (string) $result->get_body_value( 'error_description', $result->get_body_value( 'error', '' ) );
			throw new Registration_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'DCR returned HTTP %d: %s', $result->get_status(), $error_message ),
			);
		}

		$body = $result->get_body();
		if ( ! \is_array( $body ) || empty( $body['client_id'] ) ) {
			throw new Registration_Failed_Exception( 'DCR returned invalid response.' );
		}

		return $this->store_credentials( $body );
	}

	/**
	 * Strips server-assigned fields from metadata for a RFC 7592 PUT request.
	 *
	 * Per RFC 7592 §2.2, the update request body MUST NOT include fields
	 * that are assigned by the server (e.g. registration_client_uri,
	 * client_id_issued_at, client_secret, client_secret_expires_at).
	 * The software_statement is also stripped since a fresh one is provided.
	 *
	 * phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- OAuth metadata is an associative array with heterogeneous values.
	 *
	 * @param array<string, mixed> $metadata The stored client metadata.
	 *
	 * @return array<string, mixed> The metadata suitable for a PUT request body.
	 *
	 * phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
	 */
	private function build_update_request_body( array $metadata ): array {
		unset(
			$metadata['registration_access_token'],
			$metadata['registration_client_uri'],
			$metadata['client_id_issued_at'],
			$metadata['client_secret'],
			$metadata['client_secret_expires_at'],
			$metadata['software_statement'],
		);

		return $metadata;
	}
}
