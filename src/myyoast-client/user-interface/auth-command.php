<?php

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Exception;
use WP_CLI;
use WP_CLI\ExitException;
use WP_CLI\Utils;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Loadable_Interface;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client_Cleanup;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Exceptions\Invalid_Resource_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;

/**
 * Manages the MyYoast OAuth client registration, tokens, and authorization.
 *
 * These commands are intended to be used with the global --user flag to set the
 * WordPress user context. For example: wp yoast auth status --user=admin
 */
final class Auth_Command implements Command_Interface, Loadable_Interface {

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
	 * The cleanup service.
	 *
	 * @var MyYoast_Client_Cleanup
	 */
	private $cleanup;

	/**
	 * Auth_Command constructor.
	 *
	 * @param MyYoast_Client                $myyoast_client      The MyYoast client facade.
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 * @param Issuer_Config                 $issuer_config       The issuer configuration.
	 * @param Token_Storage_Interface       $token_storage       The site-level token storage port.
	 * @param User_Token_Storage_Interface  $user_token_storage  The user-level token storage port.
	 * @param MyYoast_Client_Cleanup        $cleanup             The cleanup service.
	 */
	public function __construct(
		MyYoast_Client $myyoast_client,
		Client_Registration_Interface $client_registration,
		Issuer_Config $issuer_config,
		Token_Storage_Interface $token_storage,
		User_Token_Storage_Interface $user_token_storage,
		MyYoast_Client_Cleanup $cleanup
	) {
		$this->myyoast_client      = $myyoast_client;
		$this->client_registration = $client_registration;
		$this->issuer_config       = $issuer_config;
		$this->token_storage       = $token_storage;
		$this->user_token_storage  = $user_token_storage;
		$this->cleanup             = $cleanup;
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
	 * Returns the conditionals based on which this command should be registered.
	 *
	 * @return array<string> The array of conditionals.
	 */
	public static function get_conditionals() {
		return [ MyYoast_Connection_Conditional::class ];
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
	 * [--resource=<uri>]
	 * : Show status for a specific RFC 8707 resource indicator. Omit to target the default resource. Cannot be combined with --all-resources.
	 *
	 * [--all-resources]
	 * : Show status for every stored resource bucket. Cannot be combined with --resource.
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
	 *     wp yoast auth status --resource=https://ai.yoa.st
	 *     wp yoast auth status --all-resources
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
		$has_software      = ( $this->issuer_config->get_software_statement() !== '' );
		$has_iat           = ( $this->issuer_config->get_initial_access_token() !== '' );
		$is_registered     = $this->myyoast_client->is_registered();
		$client_id         = null;
		$registered_client = $this->client_registration->get_registered_client();

		if ( $registered_client !== null ) {
			$client_id = $registered_client->get_client_id();
		}

		$has_all  = (bool) Utils\get_flag_value( $assoc_args, 'all-resources', false );
		$resource = Utils\get_flag_value( $assoc_args, 'resource' );

		if ( $has_all && $resource !== null && $resource !== '' ) {
			WP_CLI::error( '--all-resources and --resource cannot be combined.' );
		}

		if ( $has_all ) {
			$user_tokens = ( $user_id > 0 ) ? $this->user_token_storage->get_all( $user_id ) : [];
			$site_tokens = $this->token_storage->get_all();
		}
		else {
			try {
				$resource_filter = new Resource_Indicator( ( $resource !== null && $resource !== '' ) ? (string) $resource : null );
			}
			catch ( Invalid_Resource_Exception $e ) {
				WP_CLI::error( 'Invalid resource indicator: ' . $e->getMessage() );
				return;
			}

			$user_tokens = ( $user_id > 0 ) ? \array_filter( [ $this->user_token_storage->get( $user_id, $resource_filter ) ] ) : [];
			$site_tokens = \array_filter( [ $this->token_storage->get( $resource_filter ) ] );
		}

		$format = Utils\get_flag_value( $assoc_args, 'format', 'table' );

		$data = [
			'issuer_url'           => $issuer_url,
			'software_statement'   => ( $has_software ) ? 'configured' : 'not configured',
			'initial_access_token' => ( $has_iat ) ? 'configured' : 'not configured',
			'registered'           => ( $is_registered ) ? 'yes' : 'no',
			'client_id'            => ( $client_id ?? '-' ),
			'user_id'              => ( $user_id > 0 ) ? $user_id : 'none (use --user flag)',
			'user_tokens'          => $this->build_token_inventory( $user_tokens ),
			'site_tokens'          => $this->build_token_inventory( $site_tokens ),
		];

		$this->output( $data, $format );
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
		if ( Utils\get_flag_value( $assoc_args, 'force', false ) ) {
			$this->myyoast_client->deregister();
			WP_CLI::log( 'Deregistered existing client.' );
		}

		try {
			$client = $this->myyoast_client->ensure_registered();
		} catch ( Exception $e ) {
			WP_CLI::error( 'Registration failed: ' . $e->getMessage() );
			return;
		}

		$this->output(
			[
				'client_id' => $client->get_client_id(),
				'status'    => 'registered',
			],
			Utils\get_flag_value( $assoc_args, 'format', 'table' ),
		);

		WP_CLI::success( 'Client registered: ' . $client->get_client_id() );
	}

	/**
	 * Refreshes the client registration status against the server.
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
	 *     wp yoast auth refresh-status
	 *     wp yoast auth refresh-status --format=json
	 *
	 * @subcommand refresh-status
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 *
	 * @throws ExitException When the status refresh fails.
	 */
	public function refresh_status( $args = null, $assoc_args = null ): void {
		if ( ! $this->myyoast_client->is_registered() ) {
			WP_CLI::error( 'Not registered. Run "wp yoast auth register" first.' );
		}

		try {
			$metadata = $this->myyoast_client->refresh_registration_status();
		} catch ( Exception $e ) {
			WP_CLI::error( 'Status refresh failed: ' . $e->getMessage() );
			return;
		}

		// Redact sensitive fields.
		unset( $metadata['registration_access_token'] );

		$this->output( $metadata, Utils\get_flag_value( $assoc_args, 'format', 'table' ) );

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

		if ( Utils\get_flag_value( $assoc_args, 'local-only', false ) ) {
			$this->client_registration->delete_local_data();
			$this->myyoast_client->clear_all_site_tokens();
			WP_CLI::success( 'Local registration data cleared.' );
			return;
		}

		$result = $this->myyoast_client->deregister();
		$this->myyoast_client->clear_all_site_tokens();

		if ( $result ) {
			WP_CLI::success( 'Client deregistered.' );
		}
		else {
			WP_CLI::warning( 'Server-side deregistration failed (network error). Local token was cleared but client credentials remain.' );
		}
	}

	/**
	 * Resets all MyYoast OAuth client state on this site.
	 *
	 * Performs the same cleanup as plugin uninstall: best-effort server-side
	 * deregistration, then deletes all site/user tokens, registered client
	 * credentials, key pairs, and OIDC/JWKS/DPoP caches. Intended for
	 * development environments that need to start from a clean slate without
	 * uninstalling the plugin.
	 *
	 * ## OPTIONS
	 *
	 * [--yes]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth reset
	 *     wp yoast auth reset --yes
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function reset( $args = null, $assoc_args = null ): void {
		WP_CLI::confirm( 'This will wipe all MyYoast OAuth client state on this site (registered client, site/user tokens, key pairs, OIDC/JWKS/DPoP caches). Proceed?', $assoc_args );

		$this->cleanup->execute();

		WP_CLI::success( 'MyYoast OAuth client state cleared.' );
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
	 * [--resource=<uri>]
	 * : RFC 8707 resource indicator to bind the token to (e.g. https://ai.yoa.st). Omit for the default resource.
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
	 *     # Site-level token for a non-default resource:
	 *     wp yoast auth authorize --site --resource=https://ai.yoa.st --scopes=service:ai:consume
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
		$scopes             = $this->parse_scopes( $assoc_args );
		$format             = Utils\get_flag_value( $assoc_args, 'format', 'table' );
		$resource           = Utils\get_flag_value( $assoc_args, 'resource' );
		$resource_indicator = ( $resource !== null && $resource !== '' ) ? (string) $resource : null;

		if ( Utils\get_flag_value( $assoc_args, 'site', false ) ) {
			$this->authorize_site( $scopes, $resource_indicator, $format );
			return;
		}

		$this->authorize_user( $assoc_args, $scopes, $resource_indicator, $format );
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
	 * [--resource=<uri>]
	 * : Limit revocation to a single RFC 8707 resource indicator. Omit to target the default resource.
	 *
	 * [--all-resources]
	 * : Revoke every stored token across all resource indicators. Cannot be combined with --resource.
	 *
	 * [--yes]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast auth revoke --user=admin
	 *     wp yoast auth revoke --site
	 *     wp yoast auth revoke --user=admin --site --yes
	 *     wp yoast auth revoke --user=admin --resource=https://ai.yoa.st
	 *     wp yoast auth revoke --user=admin --site --all-resources
	 *
	 * @when after_wp_load
	 *
	 * @param array<int, string>|null    $args       The arguments.
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function revoke( $args = null, $assoc_args = null ): void {
		$user_id           = \get_current_user_id();
		$has_user          = ( $user_id > 0 );
		$has_site          = (bool) Utils\get_flag_value( $assoc_args, 'site', false );
		$has_all_resources = (bool) Utils\get_flag_value( $assoc_args, 'all-resources', false );
		$resource          = Utils\get_flag_value( $assoc_args, 'resource' );

		if ( ! $has_site && ! $has_user ) {
			WP_CLI::error( 'Specify --site and/or use the global --user flag.' );
		}

		if ( $has_all_resources && $resource !== null && $resource !== '' ) {
			WP_CLI::error( '--all-resources and --resource cannot be combined.' );
		}

		$resource_indicator = null;
		if ( $resource !== null && $resource !== '' ) {
			$resource_indicator = (string) $resource;
			try {
				new Resource_Indicator( $resource_indicator );
			}
			catch ( Invalid_Resource_Exception $e ) {
				WP_CLI::error( 'Invalid resource indicator: ' . $e->getMessage() );
				return;
			}
		}

		WP_CLI::confirm( 'This will revoke the specified tokens. Proceed?', $assoc_args );

		try {
			if ( $has_user ) {
				if ( $has_all_resources ) {
					$this->myyoast_client->revoke_all_user_tokens( $user_id );
					WP_CLI::log( \sprintf( 'User %d tokens revoked across all resources.', $user_id ) );
				}
				else {
					$this->myyoast_client->revoke_user_token( $user_id, $resource_indicator );
					WP_CLI::log( \sprintf( 'User %d tokens revoked.', $user_id ) );
				}
			}

			if ( $has_site ) {
				if ( $has_all_resources ) {
					$this->myyoast_client->clear_all_site_tokens();
					WP_CLI::log( 'All site tokens cleared.' );
				}
				else {
					$this->myyoast_client->clear_site_token( $resource_indicator );
					WP_CLI::log( 'Site token cleared.' );
				}
			}
		}
		catch ( Exception $e ) {
			WP_CLI::error( 'Revocation failed: ' . $e->getMessage() );
			return;
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
		$rotate_all          = (bool) Utils\get_flag_value( $assoc_args, 'all', false );
		$rotate_registration = ( $rotate_all || (bool) Utils\get_flag_value( $assoc_args, 'registration', false ) );
		$rotate_dpop         = ( $rotate_all || (bool) Utils\get_flag_value( $assoc_args, 'dpop', false ) );

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
	 * @param string[]    $scopes             The scopes to request.
	 * @param string|null $resource_indicator The resource indicator (RFC 8707), or null for the default resource.
	 * @param string      $format             The output format.
	 *
	 * @return void
	 *
	 * @throws ExitException When the token request fails.
	 */
	private function authorize_site( array $scopes, ?string $resource_indicator, string $format ): void {
		try {
			$token_set = $this->myyoast_client->get_site_token( $scopes, $resource_indicator );
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
	 * @param array<string, string> $assoc_args         The associative arguments.
	 * @param string[]              $scopes             The scopes to request.
	 * @param string|null           $resource_indicator The resource indicator (RFC 8707), or null for the default resource.
	 * @param string                $format             The output format.
	 *
	 * @return void
	 *
	 * @throws ExitException When authorization fails.
	 */
	private function authorize_user( array $assoc_args, array $scopes, ?string $resource_indicator, string $format ): void {
		$user_id = \get_current_user_id();
		if ( $user_id <= 0 ) {
			WP_CLI::error( 'User authorization requires the global --user flag.' );
		}

		$code  = Utils\get_flag_value( $assoc_args, 'code' );
		$state = Utils\get_flag_value( $assoc_args, 'state' );

		// Phase 2: exchange the code. The resource was persisted in the flow state during phase 1.
		if ( $code !== null && $state !== null ) {
			try {
				$token_set = $this->myyoast_client->exchange_authorization_code(
					$user_id,
					(string) $code,
					(string) $state,
				);
			} catch ( Exception $e ) {
				WP_CLI::error( 'Code exchange failed: ' . $e->getMessage() );
				return;
			}

			$this->output( $this->build_token_info( $token_set ), $format );

			WP_CLI::success( 'User authorized.' );
			return;
		}

		if ( $code !== null || $state !== null ) {
			WP_CLI::error( 'Both --code and --state are required for code exchange.' );
		}

		// Phase 1: generate the authorization URL. Registration is a prerequisite.
		if ( ! $this->myyoast_client->is_registered() ) {
			WP_CLI::error( 'Not registered. Run "wp yoast auth register" first.' );
		}

		try {
			$url = $this->myyoast_client->get_authorization_url( $user_id, $scopes, $resource_indicator );
		} catch ( Exception $e ) {
			WP_CLI::error( 'Failed to generate authorization URL: ' . $e->getMessage() );
			return;
		}

		if ( Utils\get_flag_value( $assoc_args, 'url-only', false ) ) {
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
				'resource'    => '-',
				'status'      => 'none',
				'expires'     => '-',
				'scopes'      => '-',
				'error_count' => '-',
			];
		}

		return [
			'resource'    => ( $token_set->get_resource_indicator()->is_default() ? '(default)' : $token_set->get_resource_indicator()->value() ),
			'status'      => ( $token_set->is_expired() ) ? 'expired' : 'valid',
			'expires'     => \gmdate( 'Y-m-d H:i:s', $token_set->get_expires_at() ) . ' UTC',
			'scopes'      => ( $token_set->get_scope() ?? '-' ),
			'error_count' => $token_set->get_error_count(),
		];
	}

	/**
	 * Builds a display-safe inventory of tokens across resource buckets.
	 *
	 * @param Token_Set[] $token_sets The token sets.
	 *
	 * @return array<int, array<string, string|int>> The inventory.
	 */
	private function build_token_inventory( array $token_sets ): array {
		$inventory = [];
		foreach ( $token_sets as $token_set ) {
			$inventory[] = $this->build_token_info( $token_set );
		}
		return $inventory;
	}

	/**
	 * Parses the comma-separated scopes option.
	 *
	 * @param array<string, string>|null $assoc_args The associative arguments.
	 *
	 * @return string[] The parsed scopes.
	 */
	private function parse_scopes( $assoc_args ): array {
		$scopes = Utils\get_flag_value( $assoc_args, 'scopes', '' );
		if ( $scopes === '' ) {
			return [];
		}

		return \array_values( \array_filter( \array_map( 'trim', \explode( ',', (string) $scopes ) ) ) );
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
				$result[ $key ] = ( \wp_json_encode( $value ) ?? 'err' );
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

		$flat_data = $this->flatten_for_display( $data );
		$items     = [];
		foreach ( $flat_data as $key => $value ) {
			$items[] = [
				'field' => $key,
				'value' => $value,
			];
		}

		WP_CLI\Utils\format_items( 'table', $items, [ 'field', 'value' ] );
	}
}
