<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when on a Yoast SEO admin page.
 */
class Admin_Page_Conditional implements Conditional {

	/**
	 * Returns `true` when on the admin dashboard, update or Yoast SEO pages.
	 *
	 * @returns bool `true` when on the admin dashboard, update or Yoast SEO pages.
	 */
	public function is_met() {
		// Do not output on plugin / theme upgrade pages or when WordPress is upgrading.
		if ( ( \defined( 'IFRAME_REQUEST' ) && \IFRAME_REQUEST ) || \wp_installing() ) {
			return false;
		}

		$page = filter_input( INPUT_GET, 'page' );

		if ( $GLOBALS['pagenow'] === 'admin.php' && $page && \strpos( $page, 'wpseo' ) === 0 ) {
			return true;
		}

		return false;
	}
}
