<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Triggers database migrations and handles results.
 */
class Disable_Core_Sitemaps implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Disable the WP core XML sitemaps.
	 */
	public function register_hooks() {
		add_filter( 'wp_sitemaps_is_enabled', '__return_false' );
	}
}
