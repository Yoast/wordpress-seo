<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Disables the WP core sitemaps.
 */
class Disable_Core_Sitemaps implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Disable the WP core XML sitemaps.
	 */
	public function register_hooks() {
		\add_filter( 'wp_sitemaps_enabled', '__return_false' );
	}
}
