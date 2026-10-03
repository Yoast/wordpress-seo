<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\General\User_Interface\General_Page_Integration;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Callback_Handler;

/**
 * Handles the OAuth authorization-code callback redirect.
 *
 * Registers a dedicated callback endpoint on `admin-post.php` (reachable for
 * any logged-in user, regardless of which admin page the flow started from) as
 * the site's OAuth redirect URI, hooks the matching `admin_post_*` action,
 * drives the callback handler (which exchanges the returning code and records
 * the outcome for one-shot surfacing), and redirects the user to the
 * `return_url` they were sent off from.
 *
 * This endpoint's URL is the canonical OAuth redirect URI: the redirect-URI
 * provider resolves it directly from `get_callback_url()`, so the callback
 * never depends on a specific admin page being loaded.
 */
class OAuth_Callback_Integration implements Integration_Interface {

	public const CALLBACK_ACTION = 'yoast_myyoast_oauth_callback';

	/**
	 * The callback handler — performs the callback-URL-agnostic orchestration.
	 *
	 * @var OAuth_Callback_Handler
	 */
	private $callback_handler;

	/**
	 * The authorization code handler — used to read the stored return URL.
	 *
	 * @var Authorization_Code_Handler
	 */
	private $auth_code_handler;

	/**
	 * The redirect helper — kept behind an injectable seam to keep the `exit`
	 * out of the unit tests.
	 *
	 * @var Redirect_Helper
	 */
	private $redirect_helper;

	/**
	 * Constructor.
	 *
	 * @param OAuth_Callback_Handler     $callback_handler  The callback handler.
	 * @param Authorization_Code_Handler $auth_code_handler The authorization code handler.
	 * @param Redirect_Helper            $redirect_helper   The redirect helper.
	 */
	public function __construct(
		OAuth_Callback_Handler $callback_handler,
		Authorization_Code_Handler $auth_code_handler,
		Redirect_Helper $redirect_helper
	) {
		$this->callback_handler  = $callback_handler;
		$this->auth_code_handler = $auth_code_handler;
		$this->redirect_helper   = $redirect_helper;
	}

	/**
	 * Returns the conditionals on which this integration should be loaded.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ MyYoast_Connection_Conditional::class ];
	}

	/**
	 * Registers the callback endpoint and points the site's OAuth redirect URI at it.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_post_' . self::CALLBACK_ACTION, [ $this, 'handle' ] );
	}

	/**
	 * Returns this site's dedicated OAuth callback endpoint URL.
	 *
	 * @return string The callback URL.
	 */
	public static function get_callback_url(): string {
		return \get_admin_url( null, 'admin-post.php?action=' . self::CALLBACK_ACTION );
	}

	/**
	 * Handles the OAuth callback request.
	 *
	 * @return void
	 */
	public function handle(): void {
		$user_id    = \get_current_user_id();
		$return_url = $this->resolve_return_url( $user_id );

		// admin_post_* (no _nopriv variant) only fires for logged-in users, so $user_id should
		// always be > 0 here. Defensive check in case the hook is dispatched manually.
		if ( $user_id <= 0 ) {
			$this->redirect_helper->do_safe_redirect( $return_url );
			return;
		}

		// The handler records the outcome for the next page load to surface; this
		// endpoint only needs to send the browser back where the flow started.
		$this->callback_handler->handle(
			$user_id,
			$this->read_query_arg( 'code' ),
			$this->read_query_arg( 'state' ),
			$this->read_query_arg( 'error' ),
		);

		$this->redirect_helper->do_safe_redirect( $return_url );
	}

	/**
	 * Resolves the URL to send the browser back to after the callback runs.
	 *
	 * Falls back to the integrations page when no return URL is stored
	 * (stale bookmark, no pending flow).
	 *
	 * @param int $user_id The WordPress user ID.
	 *
	 * @return string The return URL.
	 */
	private function resolve_return_url( int $user_id ): string {
		$fallback = \admin_url( 'admin.php?page=' . General_Page_Integration::PAGE );

		if ( $user_id > 0 ) {
			$stored = $this->auth_code_handler->get_return_url( $user_id );
			if ( \is_string( $stored ) && $stored !== '' ) {
				// Defense in depth: the stored URL is only ever written as an
				// admin_url by the management route, but validate it against the
				// site's own host before redirecting so a tampered store entry
				// can't become an open redirect.
				return \wp_validate_redirect( $stored, $fallback );
			}
		}

		return $fallback;
	}

	/**
	 * Reads a query argument, returning an empty string when missing.
	 *
	 * @param string $name The query argument name.
	 *
	 * @return string The sanitized value.
	 */
	private function read_query_arg( string $name ): string {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- CSRF defense is OAuth `state` validated inside exchange_code.
		if ( ! isset( $_GET[ $name ] ) || ! \is_string( $_GET[ $name ] ) ) {
			return '';
		}
		return \sanitize_text_field( \wp_unslash( $_GET[ $name ] ) );
		// phpcs:enable WordPress.Security.NonceVerification.Recommended
	}
}
