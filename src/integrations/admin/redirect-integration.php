<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Redirect_Integration.
 */
class Redirect_Integration implements Integration_Interface {

	/**
	 * The redirect helper.
	 *
	 * @var Redirect_Helper
	 */
	private $redirect;

	/**
	 * Sets the helpers.
	 *
	 * @param Redirect_Helper $redirect The redirect helper.
	 */
	public function __construct( Redirect_Helper $redirect ) {
		$this->redirect = $redirect;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_loaded', [ $this, 'old_settings_redirect' ] );
	}

	/**
	 * Redirect to new settings URLs. We're adding this, so that not-updated add-ons don't point to non-existent pages.
	 *
	 * @return void
	 */
	public function old_settings_redirect() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( ! isset( $_GET['page'] ) ) {
			return;
		}
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		$current_page = \sanitize_text_field( \wp_unslash( $_GET['page'] ) );

		switch ( $current_page ) {
			case 'wpseo_titles':
				$this->redirect->do_safe_redirect( \admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' ), 301 );
				return;
			default:
				return;
		}
	}
}
