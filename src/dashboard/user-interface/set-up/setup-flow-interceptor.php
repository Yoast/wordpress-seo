<?php

namespace Yoast\WP\SEO\Dashboard\User_Interface\Set_Up;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

class Setup_Flow_Interceptor implements Integration_Interface {

	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'intercept_site_kit_setup_flow' ], 999 );
	}

	/**
	 * The conditions for this integration to load.
	 *
	 * @return string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Google_Site_Kit_Feature_Conditional::class, Admin_Conditional::class ];
	}

	/**
	 * Checks if we should intercept the final page from the Site Kit flow.
	 *
	 * @return void
	 */
	public function intercept_site_kit_setup_flow() {
		if ( \get_transient( Setup_Url_Interceptor::SITE_KIT_SETUP_TRANSIENT ) == 1 && $this->is_site_kit_setup_completed_page() ) {
			\delete_transient( Setup_Url_Interceptor::SITE_KIT_SETUP_TRANSIENT );
			\wp_safe_redirect( \self_admin_url( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit' ), 302, 'Yoast SEO' );
			exit;
		}
	}

	/**
	 * Checks if we are on the site kit setup completed page.
	 *
	 * @return bool
	 */
	private function is_site_kit_setup_completed_page(): bool {
		return true;
	}
}
