<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Exception;
use WP_CLI;
use WP_CLI\ExitException;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;

/**
 * Manages the MyYoast OAuth client registration, tokens, and authorization.
 *
 * These commands are intended to be used with the global --user flag to set the
 * WordPress user context. For example: wp yoast auth status --user=admin
 */
final class Auth_Command implements Command_Interface {

	/**
	 * The MyYoast client facade.
	 *
	 * @var MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

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
	 * Auth_Command constructor.
	 *
	 * @param MyYoast_Client                $myyoast_client      The MyYoast client facade.
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 * @param Issuer_Config                 $issuer_config       The issuer configuration.
	 * @param Token_Storage_Interface       $token_storage       The site-level token storage port.
	 * @param User_Token_Storage_Interface  $user_token_storage  The user-level token storage port.
	 */
	public function __construct(
		MyYoast_Client $myyoast_client,
		Client_Registration_Interface $client_registration,
		Issuer_Config $issuer_config,
		Token_Storage_Interface $token_storage,
		User_Token_Storage_Interface $user_token_storage
	) {
		$this->myyoast_client      = $myyoast_client;
		$this->client_registration = $client_registration;
		$this->issuer_config       = $issuer_config;
		$this->token_storage       = $token_storage;
		$this->user_token_storage  = $user_token_storage;
	}

	/**
	 * Returns the namespace of this command.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE . ' auth';
	}

	/**
	 * Shows the current MyYoast OAuth client status.
	 *
	 * Displays issuer configuration, registration state, and token status
	 * without making any network calls. Use the global --user flag to check
	 * a specific user's token status.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Output format.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth status
	 *     wp yoast auth status --user=admin
	 *     wp yoast auth status --format=json
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function status( $args = null, $assoc_args = null ): void {
		$user_id = \get_current_user_id();

		$issuer_url        = $this->issuer_config->get_issuer_url();
		$issuer_env        = \getenv( 'YOAST_MYYOAST_ISSUER_URL' );
		$has_software      = ( $this->issuer_config->get_software_statement() !== '' );
		$has_iat           = ( $this->issuer_config->get_initial_access_token() !== '' );
		$is_registered     = $this->myyoast_client->is_registered();
		$client_id         = null;
		$registered_client = $this->client_registration->get_registered_client();

		if ( $registered_client !== null ) {
			$client_id = $registered_client->get_client_id();
		}

		$site_token      = $this->token_storage->get();
		$site_token_info = $this->build_token_info( $site_token );

		$user_token      = ( $user_id > 0 ) ? $this->user_token_storage->get( $user_id ) : null;
		$user_token_info = $this->build_token_info( $user_token );

		$data = [
			'issuer_url'           => $issuer_url,
			'issuer_overridden'    => ( $issuer_env !== false && $issuer_env !== '' ) ? 'yes (env)' : 'no',
			'software_statement'   => ( $has_software ) ? 'configured' : 'not configured',
			'initial_access_token' => ( $has_iat ) ? 'configured' : 'not configured',
			'registered'           => ( $is_registered ) ? 'yes' : 'no',
			'client_id'            => ( $client_id ?? '-' ),
			'site_token'           => $site_token_info['status'],
			'site_token_expires'   => $site_token_info['expires'],
			'site_token_scopes'    => $site_token_info['scopes'],
			'user_id'              => ( $user_id > 0 ) ? $user_id : 'none (use --user flag)',
			'user_token'           => $user_token_info['status'],
			'user_token_expires'   => $user_token_info['expires'],
			'user_token_scopes'    => $user_token_info['scopes'],
			'user_token_errors'    => $user_token_info['error_count'],
		];

		$this->output( $data, $assoc_args['format'] );
	}

	/**
	 * Registers the site as an OAuth client.
	 *
	 * Performs Dynamic Client Registration (RFC 7591) if the site is not
	 * already registered. Use --force to deregister and re-register.
	 *
	 * ## OPTIONS
	 *
	 * [--force]
	 * : Deregister first, then re-register.
	 *
	 * [--format=<format>]
	 * : Output format.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth register
	 *     wp yoast auth register --force
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 *
	 * @throws ExitException When registration fails.
	 */
	public function register( $args = null, $assoc_args = null ): void {
		if ( isset( $assoc_args['force'] ) ) {
			$this->myyoast_client->deregister();
			WP_CLI::log( 'Deregistered existing client.' );
		}

		try {
			$redirect_uri = \get_admin_url( null, 'admin.php?page=wpseo_dashboard&yoast_myyoast_oauth_callback=1' );
			$client       = $this->myyoast_client->ensure_registered( [ $redirect_uri ] );
		} catch ( Exception $e ) {
			WP_CLI::error( 'Registration failed: ' . $e->getMessage() );
			return;
		}

		$this->output(
			[
				'client_id' => $client->get_client_id(),
				'status'    => 'registered',
			],
			$assoc_args['format'],
		);

		WP_CLI::success( 'Client registered: ' . $client->get_client_id() );
	}

	/**
	 * Verifies the client registration with the server.
	 *
	 * Reads the current registration from the authorization server to
	 * confirm it is still valid and shows the registration metadata.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Output format.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth verify
	 *     wp yoast auth verify --format=json
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 *
	 * @throws ExitException When verification fails.
	 */
	public function verify( $args = null, $assoc_args = null ): void {
		if ( ! $this->myyoast_client->is_registered() ) {
			WP_CLI::error( 'Not registered. Run "wp yoast auth register" first.' );
		}

		try {
			$metadata = $this->myyoast_client->verify_registration();
		} catch ( Exception $e ) {
			WP_CLI::error( 'Verification failed: ' . $e->getMessage() );
			return;
		}

		// Redact sensitive fields.
		unset( $metadata['registration_access_token'] );

		$this->output( $this->flatten_for_display( $metadata ), $assoc_args['format'] );

		WP_CLI::success( 'Registration is valid.' );
	}

	/**
	 * Removes the OAuth client registration.
	 *
	 * Deletes the client registration from the authorization server and
	 * clears all local registration data and cached tokens.
	 *
	 * ## OPTIONS
	 *
	 * [--local-only]
	 * : Only delete local data without contacting the server.
	 *
	 * [--yes]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth deregister
	 *     wp yoast auth deregister --local-only
	 *     wp yoast auth deregister --yes
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function deregister( $args = null, $assoc_args = null ): void {
		if ( ! $this->myyoast_client->is_registered() ) {
			WP_CLI::warning( 'Not registered. Nothing to do.' );
			return;
		}

		WP_CLI::confirm( 'This will deregister this site from MyYoast and clear all cached tokens. Proceed?', $assoc_args );

		if ( isset( $assoc_args['local-only'] ) ) {
			$this->client_registration->delete_local_data();
			$this->myyoast_client->clear_site_token();
			WP_CLI::success( 'Local registration data cleared.' );
			return;
		}

		$result = $this->myyoast_client->deregister();
		$this->myyoast_client->clear_site_token();

		if ( $result ) {
			WP_CLI::success( 'Client deregistered.' );
		}
		else {
			WP_CLI::warning( 'Server-side deregistration failed (network error). Local token was cleared but client credentials remain.' );
		}
	}

	/**
	 * Authorizes with MyYoast using the authorization code flow or client credentials.
	 *
	 * Without --site, starts the user authorization code flow:
	 * 1. Run without --code to get the authorization URL.
	 * 2. Visit the URL in a browser and authorize.
	 * 3. Copy the code and state from the callback URL.
	 * 4. Run again with --code and --state to exchange for tokens.
	 *
	 * With --site, performs a client_credentials grant for a site-level token.
	 *
	 * ## OPTIONS
	 *
	 * [--site]
	 * : Use client_credentials grant for a site-level token (no browser needed).
	 *
	 * [--scopes=<scopes>]
	 * : Comma-separated scopes to request.
	 *
	 * [--code=<code>]
	 * : Authorization code from the callback URL (user flow phase 2).
	 *
	 * [--state=<state>]
	 * : State parameter from the callback URL (user flow phase 2).
	 *
	 * [--url-only]
	 * : Only print the authorization URL without instructions (user flow phase 1).
	 *
	 * [--format=<format>]
	 * : Output format.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     # Site-level token (client_credentials):
	 *     wp yoast auth authorize --site --scopes=service:analytics
	 *
	 *     # User authorization code flow, phase 1 - get the URL:
	 *     wp yoast auth authorize --user=admin --scopes=openid,profile
	 *
	 *     # User authorization code flow, phase 2 - exchange the code:
	 *     wp yoast auth authorize --user=admin --code=abc123 --state=xyz789
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 *
	 * @throws ExitException When authorization fails.
	 */
	public function authorize( $args = null, $assoc_args = null ): void {
		$scopes = $this->parse_scopes( $assoc_args );

		if ( isset( $assoc_args['site'] ) ) {
			$this->authorize_site( $scopes, $assoc_args['format'] );
			return;
		}

		$this->authorize_user( $assoc_args, $scopes, $assoc_args['format'] );
	}

	/**
	 * Revokes tokens for the current user and/or the site.
	 *
	 * Without --site, revokes the current user's tokens (requires --user flag).
	 * With --site, clears the cached site-level token.
	 * Both can be combined.
	 *
	 * ## OPTIONS
	 *
	 * [--site]
	 * : Clear the cached site-level token.
	 *
	 * [--yes]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth revoke --user=admin
	 *     wp yoast auth revoke --site
	 *     wp yoast auth revoke --user=admin --site --yes
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function revoke( $args = null, $assoc_args = null ): void {
		$user_id  = \get_current_user_id();
		$has_site = isset( $assoc_args['site'] );
		$has_user = ( $user_id > 0 );

		if ( ! $has_site && ! $has_user ) {
			WP_CLI::error( 'Specify --site and/or use the global --user flag.' );
		}

		WP_CLI::confirm( 'This will revoke the specified tokens. Proceed?', $assoc_args );

		if ( $has_user ) {
			$this->myyoast_client->revoke_user_token( $user_id );
			WP_CLI::log( \sprintf( 'User %d tokens revoked.', $user_id ) );
		}

		if ( $has_site ) {
			$this->myyoast_client->clear_site_token();
			WP_CLI::log( 'Site token cleared.' );
		}

		WP_CLI::success( 'Done.' );
	}

	/**
	 * Rotates cryptographic key pairs.
	 *
	 * Rotates the registration key pair (server roundtrip) and/or the DPoP
	 * key pair (local only).
	 *
	 * ## OPTIONS
	 *
	 * [--registration]
	 * : Rotate the registration (private_key_jwt) key pair. Requires a server roundtrip.
	 *
	 * [--dpop]
	 * : Rotate the DPoP proof key pair (local only).
	 *
	 * [--all]
	 * : Rotate all key pairs.
	 *
	 * [--yes]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth rotate-keys --registration
	 *     wp yoast auth rotate-keys --dpop
	 *     wp yoast auth rotate-keys --all
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 *
	 * @throws ExitException When key rotation fails.
	 */
	public function rotate_keys( $args = null, $assoc_args = null ): void {
		$rotate_registration = isset( $assoc_args['registration'] ) || isset( $assoc_args['all'] );
		$rotate_dpop         = isset( $assoc_args['dpop'] ) || isset( $assoc_args['all'] );

		if ( ! $rotate_registration && ! $rotate_dpop ) {
			WP_CLI::error( 'Specify --registration, --dpop, or --all.' );
		}

		WP_CLI::confirm( 'This will rotate the specified key pairs. Existing tokens may be invalidated. Proceed?', $assoc_args );

		if ( $rotate_registration ) {
			if ( ! $this->myyoast_client->is_registered() ) {
				WP_CLI::error( 'Not registered. Run "wp yoast auth register" first.' );
			}

			try {
				$client = $this->myyoast_client->rotate_registration_keys();
				WP_CLI::log( 'Registration keys rotated. Client ID: ' . $client->get_client_id() );
			} catch ( Exception $e ) {
				WP_CLI::error( 'Registration key rotation failed: ' . $e->getMessage() );
				return;
			}
		}

		if ( $rotate_dpop ) {
			$this->myyoast_client->rotate_dpop_keys();
			WP_CLI::log( 'DPoP keys rotated.' );
		}

		WP_CLI::success( 'Key rotation complete.' );
	}

	/**
	 * Performs a client_credentials grant for a site-level token.
	 *
	 * @param string[] $scopes The scopes to request.
	 * @param string   $format The output format.
	 *
	 * @return void
	 *
	 * @throws ExitException When the token request fails.
	 */
	private function authorize_site( array $scopes, string $format ): void {
		try {
			$token_set = $this->myyoast_client->get_site_token( $scopes );
		} catch ( Exception $e ) {
			WP_CLI::error( 'Site token request failed: ' . $e->getMessage() );
			return;
		}

		$this->output( $this->build_token_info( $token_set ), $format );

		WP_CLI::success( 'Site token obtained.' );
	}

	/**
	 * Handles the user authorization code flow.
	 *
	 * @param array<string, string> $assoc_args The associative arguments.
	 * @param string[]              $scopes     The scopes to request.
	 * @param string                $format     The output format.
	 *
	 * @return void
	 *
	 * @throws ExitException When authorization fails.
	 */
	private function authorize_user( array $assoc_args, array $scopes, string $format ): void {
		$user_id = \get_current_user_id();
		if ( $user_id <= 0 ) {
			WP_CLI::error( 'User authorization requires the global --user flag.' );
		}

		$has_code  = isset( $assoc_args['code'] );
		$has_state = isset( $assoc_args['state'] );

		// Phase 2: exchange the code.
		if ( $has_code && $has_state ) {
			try {
				$token_set = $this->myyoast_client->exchange_authorization_code(
					$user_id,
					$assoc_args['code'],
					$assoc_args['state'],
				);
			} catch ( Exception $e ) {
				WP_CLI::error( 'Code exchange failed: ' . $e->getMessage() );
				return;
			}

			$this->output( $this->build_token_info( $token_set ), $format );

			WP_CLI::success( 'User authorized.' );
			return;
		}

		if ( $has_code || $has_state ) {
			WP_CLI::error( 'Both --code and --state are required for code exchange.' );
		}

		// Phase 1: generate the authorization URL.
		$redirect_uri = \get_admin_url( null, 'admin.php?page=wpseo_dashboard&yoast_myyoast_oauth_callback=1' );

		try {
			$url = $this->myyoast_client->get_authorization_url( $user_id, $redirect_uri, $scopes );
		} catch ( Exception $e ) {
			WP_CLI::error( 'Failed to generate authorization URL: ' . $e->getMessage() );
			return;
		}

		if ( isset( $assoc_args['url-only'] ) ) {
			WP_CLI::log( $url );
			return;
		}

		WP_CLI::log( 'Visit this URL to authorize:' );
		WP_CLI::log( '' );
		WP_CLI::log( $url );
		WP_CLI::log( '' );
		WP_CLI::log( 'After authorizing, you will be redirected to a callback URL.' );
		WP_CLI::log( 'If you need to manually complete authorization, copy the "code" and "state" parameters from the URL, then run:' );
		WP_CLI::log( '' );
		WP_CLI::log(
			\sprintf(
				'  wp yoast auth authorize --user=%s --code=<CODE> --state=<STATE>',
				$user_id,
			),
		);
	}

	/**
	 * Builds a display-safe token info array.
	 *
	 * @param Token_Set|null $token_set The token set, or null.
	 *
	 * @return array<string, string|int> The token info for display.
	 */
	private function build_token_info( ?Token_Set $token_set ): array {
		if ( $token_set === null ) {
			return [
				'status'      => 'none',
				'expires'     => '-',
				'scopes'      => '-',
				'error_count' => '-',
			];
		}

		return [
			'status'      => ( $token_set->is_expired() ) ? 'expired' : 'valid',
			'expires'     => \gmdate( 'Y-m-d H:i:s', $token_set->get_expires_at() ) . ' UTC',
			'scopes'      => ( $token_set->get_scope() ?? '-' ),
			'error_count' => $token_set->get_error_count(),
		];
	}

	/**
	 * Parses the comma-separated scopes option.
	 *
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return string[] The parsed scopes.
	 */
	private function parse_scopes( $assoc_args ): array {
		if ( ! isset( $assoc_args['scopes'] ) || $assoc_args['scopes'] === '' ) {
			return [];
		}

		return \array_values( \array_filter( \array_map( 'trim', \explode( ',', $assoc_args['scopes'] ) ) ) );
	}

	/**
	 * Flattens nested arrays for table display by JSON-encoding array values.
	 *
	 * @param array<string, string|string[]|bool> $data The data to flatten.
	 *
	 * @return array<string, string> The flattened data.
	 */
	private function flatten_for_display( array $data ): array {
		$result = [];
		foreach ( $data as $key => $value ) {
			if ( \is_array( $value ) ) {
				// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- WP-CLI display output, not user-facing HTML.
				$result[ $key ] = ( \wp_json_encode( $value ) ?? '[]' );
			}
			elseif ( \is_bool( $value ) ) {
				$result[ $key ] = ( $value ) ? 'true' : 'false';
			}
			else {
				$result[ $key ] = (string) $value;
			}
		}
		return $result;
	}

	/**
	 * Outputs data in the requested format.
	 *
	 * @param array<string, string|int> $data   The data to output.
	 * @param string                    $format The output format (table or json).
	 *
	 * @return void
	 */
	private function output( array $data, string $format ): void {
		if ( $format === 'json' ) {
			// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.FoundWithAdditionalParams -- CLI output, not user-facing HTML.
			$encoded = \wp_json_encode( $data, \JSON_PRETTY_PRINT );
			WP_CLI::log( ( $encoded !== false ) ? $encoded : '{}' );
			return;
		}

		$items = [];
		foreach ( $data as $key => $value ) {
			$items[] = [
				'field' => $key,
				'value' => (string) $value,
			];
		}

		WP_CLI\Utils\format_items( 'table', $items, [ 'field', 'value' ] );
	}
}
