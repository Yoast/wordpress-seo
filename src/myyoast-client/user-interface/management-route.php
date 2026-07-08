<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Throwable;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Authorization_Flow_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Rate_Limited_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Exceptions\Invalid_Resource_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\Routes\Route_Interface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * REST endpoints for managing the site's MyYoast OAuth client registration.
 *
 * UI-side counterpart to `wp yoast auth` — every endpoint dispatches to the
 * same `MyYoast_Client` facade and returns the refreshed status payload on
 * success so the client can update its local state without a follow-up GET.
 */
class Management_Route implements Route_Interface, LoggerAwareInterface {

	use LoggerAwareTrait;

	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	public const ROUTE_PREFIX = '/myyoast';

	public const STATUS_ROUTE         = '/status';
	public const REFRESH_STATUS_ROUTE = '/refresh-status';
	public const REGISTER_ROUTE       = '/register';
	public const REGISTRATION_ROUTE   = '/registration';
	public const AUTHORIZE_ROUTE      = '/authorize';

	/**
	 * How long a successful upstream status refresh suppresses further upstream
	 * calls, in seconds. The integrations page auto-refreshes on every load, and
	 * MyYoast rate-limits the RFC 7592 read aggressively, so we throttle our own
	 * calls. This caches no response data — only the fact that we checked — so it
	 * does not conflict with the endpoint's no-store header.
	 *
	 * @var int
	 */
	private const REFRESH_THROTTLE_TTL_IN_SECONDS = \HOUR_IN_SECONDS;

	/**
	 * Transient key prefix for the refresh throttle marker. Suffixed with the
	 * issuer key so switching issuers does not carry the marker across.
	 *
	 * @var string
	 */
	private const REFRESH_THROTTLE_TRANSIENT_PREFIX = 'wpseo_myyoast_refresh_throttle';

	/**
	 * The MyYoast client facade.
	 *
	 * @var MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The status presenter.
	 *
	 * @var Status_Presenter
	 */
	private $status_presenter;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * Management_Route constructor.
	 *
	 * @param MyYoast_Client                $myyoast_client      The MyYoast client facade.
	 * @param Status_Presenter              $status_presenter    The status presenter.
	 * @param Issuer_Config                 $issuer_config       The issuer configuration.
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 */
	public function __construct(
		MyYoast_Client $myyoast_client,
		Status_Presenter $status_presenter,
		Issuer_Config $issuer_config,
		Client_Registration_Interface $client_registration
	) {
		$this->myyoast_client      = $myyoast_client;
		$this->status_presenter    = $status_presenter;
		$this->issuer_config       = $issuer_config;
		$this->client_registration = $client_registration;
		$this->logger              = new NullLogger();
	}

	/**
	 * Returns the conditionals on which this route should be registered.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ MyYoast_Connection_Conditional::class ];
	}

	/**
	 * Registers the routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$permission_callback = [ $this, 'can_manage' ];

		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE_PREFIX . self::STATUS_ROUTE,
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_status' ],
				'permission_callback' => $permission_callback,
			],
		);

		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE_PREFIX . self::REFRESH_STATUS_ROUTE,
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'refresh_status' ],
				'permission_callback' => $permission_callback,
			],
		);

		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE_PREFIX . self::REGISTER_ROUTE,
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'register' ],
				'permission_callback' => $permission_callback,
			],
		);

		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE_PREFIX . self::REGISTRATION_ROUTE,
			[
				[
					'methods'             => 'PUT',
					'callback'            => [ $this, 'update_registration' ],
					'permission_callback' => $permission_callback,
				],
				[
					'methods'             => 'DELETE',
					'callback'            => [ $this, 'deregister' ],
					'permission_callback' => $permission_callback,
				],
			],
		);

		\register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE_PREFIX . self::AUTHORIZE_ROUTE,
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'authorize' ],
				'permission_callback' => $permission_callback,
				'args'                => [
					'return_url' => [
						'type'              => 'string',
						'required'          => false,
						'description'       => 'URL to send the browser back to once the flow completes. Validated against the site host; an invalid or off-site URL is ignored.',
						'sanitize_callback' => 'esc_url_raw',
					],
				],
			],
		);
	}

	/**
	 * Permission callback for every endpoint.
	 *
	 * @return bool
	 */
	public function can_manage() {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * GET /myyoast/status — returns the current status payload.
	 *
	 * @return WP_REST_Response
	 */
	public function get_status() {
		return $this->respond_with_connection_status( 200, null );
	}

	/**
	 * POST /myyoast/refresh-status — refreshes the registration status against the server.
	 *
	 * Throttled: a successful upstream refresh suppresses further upstream calls
	 * for an hour. Within that window the call is skipped and the locally-derived
	 * status is returned unchanged, so a page reload does not hit MyYoast's rate
	 * limit. The upstream response body is never stored — only the throttle marker.
	 *
	 * @return WP_REST_Response
	 */
	public function refresh_status() {
		if ( \get_transient( $this->get_refresh_throttle_key() ) !== false ) {
			return $this->respond_with_connection_status( 200, null );
		}

		try {
			$this->myyoast_client->refresh_registration_status();
		} catch ( Registration_Failed_Exception $e ) {
			return $this->handle_exception( $e );
		}

		// Mark only on success: a failed or rate-limited attempt must not suppress the next retry.
		\set_transient( $this->get_refresh_throttle_key(), 1, self::REFRESH_THROTTLE_TTL_IN_SECONDS );

		return $this->respond_with_connection_status( 200, null );
	}

	/**
	 * POST /myyoast/register — connects the site to MyYoast.
	 *
	 * @return WP_REST_Response
	 */
	public function register() {
		$gate = $this->require_provisioned();
		if ( $gate !== null ) {
			return $gate;
		}

		try {
			$this->myyoast_client->ensure_registered();
		} catch ( Registration_Failed_Exception $e ) {
			return $this->handle_exception( $e );
		}

		$this->clear_refresh_throttle();

		return $this->respond_with_connection_status( 200, 'connect_success' );
	}

	/**
	 * PUT /myyoast/registration — re-syncs the connection's redirect URIs.
	 *
	 * Used to recover the connection after the site's URL has changed. The client
	 * resolves the current redirect URIs itself and updates the registration in
	 * place (RFC 7592 PUT) when the set differs from what is stored.
	 *
	 * @return WP_REST_Response
	 */
	public function update_registration() {
		$gate = $this->require_provisioned();
		if ( $gate !== null ) {
			return $gate;
		}

		try {
			$this->myyoast_client->ensure_registered();
		} catch ( Throwable $e ) {
			return $this->handle_exception( $e );
		}

		$this->clear_refresh_throttle();

		return $this->respond_with_connection_status( 200, 'update_success' );
	}

	/**
	 * POST /myyoast/authorize — starts the authorization-code flow and returns
	 * the URL the browser should be sent to.
	 *
	 * Completing the round-trip verifies that the site's redirect URI is
	 * reachable and that the user is who they claim to be. The client resolves
	 * the redirect URI itself, and the authorization-code handler marks it
	 * validated once the returning code is exchanged.
	 *
	 * The optional `return_url` is where the browser is sent once the flow
	 * completes; the caller supplies it because the flow can be started from
	 * different admin pages. It is validated against the site's own host, so an
	 * off-site or tampered value is dropped (and the callback then surfaces a
	 * standalone outcome rather than redirecting anywhere).
	 *
	 * @param WP_REST_Request $request The REST request.
	 *
	 * @return WP_REST_Response
	 */
	public function authorize( WP_REST_Request $request ): WP_REST_Response {
		if ( $this->client_registration->get_registered_client() === null ) {
			return $this->error_response( 'registration_gone' );
		}

		$user_id = \get_current_user_id();
		if ( $user_id <= 0 ) {
			// Return HTTP 200 with the error_code in the body like every other failure here:
			// api-fetch rejects non-2xx, which would mask invalid_user as a generic unexpected_error.
			return $this->error_response( 'invalid_user' );
		}

		$return_url = $this->resolve_return_url( $request->get_param( 'return_url' ) );

		try {
			$authorize_url = $this->myyoast_client->get_authorization_url(
				$user_id,
				[ 'openid' ],
				null,
				$return_url,
			);
		} catch ( Authorization_Flow_Exception $e ) {
			return $this->error_response( 'registration_failed', $e );
		} catch ( Invalid_Resource_Exception $e ) {
			return $this->handle_exception( $e );
		}

		$body = [
			'authorize_url' => $authorize_url,
			'status'        => $this->status_presenter->present(),
		];

		return new WP_REST_Response( $body, 200 );
	}

	/**
	 * DELETE /myyoast/registration — disconnects the site server-side and locally.
	 *
	 * @return WP_REST_Response
	 */
	public function deregister() {
		// Disconnect is best-effort on the server but always authoritative
		// locally: whatever happens with the remote RFC 7592 DELETE, the site
		// ends up disconnected here. An orphaned server-side client is cleaned up
		// automatically by MyYoast. deregister() already clears the local
		// registration and returns false (rather than throwing) on transport
		// failure.
		$remote_cleared = false;
		try {
			$remote_cleared = $this->myyoast_client->deregister();
		} catch ( Throwable $e ) {
			$this->logger->warning(
				'Unexpected error during MyYoast deregistration; disconnecting locally anyway: {error}',
				[ 'error' => $e->getMessage() ],
			);
		} finally {
			// Always clear site tokens, even when the remote call threw, so the
			// site is never left half-connected.
			$this->myyoast_client->clear_all_site_tokens();
		}

		if ( ! $remote_cleared ) {
			$this->logger->warning( 'MyYoast server-side deregistration was not confirmed; the site was disconnected locally.' );
		}

		$this->clear_refresh_throttle();

		return $this->respond_with_connection_status( 200, 'disconnect_success' );
	}

	/**
	 * Validates a caller-supplied return URL against the site's own host.
	 *
	 * The return URL is optional: callers that have nowhere meaningful to send
	 * the user back to omit it. Anything off-site or otherwise invalid is treated
	 * as absent rather than rewritten to a default — `wp_validate_redirect()` with
	 * an empty fallback yields an empty string, which we normalize to null. The
	 * callback re-validates the stored value before redirecting, so this is the
	 * first of two gates against an open redirect.
	 *
	 * @param string|null $return_url The sanitized `return_url` request parameter (the route's
	 *                                args schema coerces it to a string; absent when not sent).
	 *
	 * @return string|null The validated same-host URL, or null when none applies.
	 */
	private function resolve_return_url( ?string $return_url ): ?string {
		if ( $return_url === null || $return_url === '' ) {
			return null;
		}

		$validated = \wp_validate_redirect( $return_url, '' );

		return ( $validated === '' ) ? null : $validated;
	}

	/**
	 * Returns a "not provisioned" response when SS or IAT is empty.
	 *
	 * @return WP_REST_Response|null Response when blocked, null otherwise.
	 */
	private function require_provisioned(): ?WP_REST_Response {
		if ( $this->is_provisioned() ) {
			return null;
		}

		return $this->error_response( 'not_provisioned' );
	}

	/**
	 * Whether the plugin is provisioned for OAuth (software statement + IAT).
	 *
	 * @return bool
	 */
	private function is_provisioned(): bool {
		return ( $this->issuer_config->get_software_statement() !== '' )
			&& ( $this->issuer_config->get_initial_access_token() !== '' );
	}

	/**
	 * Maps an exception to a REST error response.
	 *
	 * The REST endpoint itself executed correctly — what failed is an upstream
	 * call to MyYoast or a precondition. We therefore return HTTP 200 with an
	 * `error_code` in the body that the UI translates into actionable copy.
	 * Genuine request-validation failures return 4xx separately (see callers).
	 *
	 * @param Throwable $exception The exception to handle.
	 *
	 * @return WP_REST_Response
	 */
	private function handle_exception( Throwable $exception ): WP_REST_Response {
		if ( $exception instanceof Registration_Not_Found_Exception ) {
			return $this->error_response( 'registration_gone', $exception );
		}

		if ( $exception instanceof Rate_Limited_Exception ) {
			$retry_after = $exception->get_retry_after_seconds();
			$details     = ( $retry_after !== null ) ? [ 'retry_after_seconds' => $retry_after ] : [];
			return $this->error_response( 'rate_limited', $exception, 200, $details );
		}

		if ( $exception instanceof Server_Capability_Exception ) {
			return $this->error_response( 'server_capability', $exception );
		}

		if ( $exception instanceof Discovery_Failed_Exception ) {
			return $this->error_response( 'myyoast_unreachable', $exception );
		}

		if ( $exception instanceof Token_Request_Failed_Exception ) {
			$code = ( $exception->get_error_code() === 'invalid_grant' ) ? 'token_request_failed_invalid_grant' : 'token_request_failed';
			return $this->error_response( $code, $exception );
		}

		if ( $exception instanceof Token_Storage_Exception ) {
			return $this->error_response( 'token_storage_failed', $exception );
		}

		if ( $exception instanceof Invalid_Resource_Exception ) {
			return $this->error_response( 'invalid_resource', $exception );
		}

		if ( $exception instanceof Registration_Failed_Exception ) {
			return $this->error_response( 'registration_failed', $exception );
		}

		$this->logger->error(
			'Unexpected exception in MyYoast management route: {message}',
			[ 'message' => $exception->getMessage() ],
		);

		return $this->error_response( 'unexpected_error', $exception );
	}

	/**
	 * Returns the issuer-scoped transient key for the refresh throttle marker.
	 *
	 * @return string The transient key.
	 */
	private function get_refresh_throttle_key(): string {
		return \sprintf(
			'%s_%s',
			self::REFRESH_THROTTLE_TRANSIENT_PREFIX,
			$this->issuer_config->get_issuer_key(),
		);
	}

	/**
	 * Clears the refresh throttle marker so the next status read hits the server.
	 *
	 * Called after any endpoint that changes the registration (connect, re-sync,
	 * disconnect): the throttle exists only to spare MyYoast's rate limit on
	 * unchanged status, so a deliberate state change must invalidate it.
	 *
	 * @return void
	 */
	private function clear_refresh_throttle(): void {
		\delete_transient( $this->get_refresh_throttle_key() );
	}

	/**
	 * Builds a successful response carrying the refreshed status payload.
	 *
	 * @param int         $status      The HTTP status.
	 * @param string|null $message_key The key in the i18n message map for the success notice, or null when none applies.
	 *
	 * @return WP_REST_Response
	 */
	private function respond_with_connection_status( int $status, ?string $message_key ): WP_REST_Response {
		$body = [
			'status' => $this->status_presenter->present(),
		];
		if ( $message_key !== null ) {
			$body['message_key'] = $message_key;
		}

		return new WP_REST_Response( $body, $status );
	}

	/**
	 * Builds an error response.
	 *
	 * Defaults to HTTP 200 — the REST endpoint succeeded; the failure is in
	 * an upstream call or precondition, and the UI keys off `error_code`,
	 * not the HTTP status. Genuine 4xx (e.g. validation failures) pass an
	 * explicit status.
	 *
	 * @param string                $error_code The machine-readable error code (looked up client-side in the i18n map).
	 * @param Throwable|null        $exception  Optional exception (logged when present).
	 * @param int                   $status     The HTTP status. Defaults to 200.
	 * @param array<string, scalar> $details    Optional extra fields the UI may use to enrich the error message.
	 *
	 * @return WP_REST_Response
	 */
	private function error_response( string $error_code, ?Throwable $exception = null, int $status = 200, array $details = [] ): WP_REST_Response {
		if ( $exception !== null ) {
			$this->logger->warning(
				'MyYoast management error ({code}): {message}',
				[
					'code'    => $error_code,
					'message' => $exception->getMessage(),
				],
			);
		}

		$body = [
			'error_code' => $error_code,
			'status'     => $this->status_presenter->present(),
		];
		if ( $details !== [] ) {
			$body['details'] = $details;
		}

		return new WP_REST_Response( $body, $status );
	}
}
