<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when in the admin on a Yoast SEO page.
 */
class Yoast_Admin_Page_Conditional implements Conditional {

	/**
	 * Checks if we are on a Yoast SEO admin page.
	 *
	 * @return bool True if we are on a Yoast SEO admin page
	 */
	public function is_met() {
		global $pagenow;

		// Do not output on iFrame requests.
		if ( ( \defined( 'IFRAME_REQUEST' ) && \IFRAME_REQUEST ) ) {
			return false;
		}

		if ( \defined( 'DOING_AJAX' ) && \DOING_AJAX ) {
			return false;
		}

		// Don't display when upgrading/installing.
		if ( \wp_installing() ) {
			return false;
		}

		return ( $pagenow === 'admin.php' && isset( $_GET['page'] ) && \strpos( $_GET['page'], 'wpseo' ) === 0 );
	}
}
