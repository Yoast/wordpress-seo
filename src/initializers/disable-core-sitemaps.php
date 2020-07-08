<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Disables the WP core sitemaps.
 */
class Disable_Core_Sitemaps implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Disable the WP core XML sitemaps.
	 */
	public function initialize() {
		\add_filter( 'wp_sitemaps_enabled', '__return_false' );
	}
}
