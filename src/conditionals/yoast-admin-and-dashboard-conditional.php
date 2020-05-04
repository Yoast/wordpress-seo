<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when in the admin dashboard, update or Yoast SEO pages.
 */
class Yoast_Admin_And_Dashboard_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		global $pagenow;

		if ( $pagenow === 'admin.php' && isset( $_GET['page'] ) && strpos( $_GET['page'], 'wpseo' ) === 0 ) {
			return true;
		}

		return \in_array( $pagenow, [
			'index.php',
			'plugins.php',
			'update-core.php',
		], true );
	}
}
