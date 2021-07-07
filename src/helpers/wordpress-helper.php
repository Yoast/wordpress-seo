<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for WordPress matters.
 *
 * Note: it is spelled like `Wordpress_Helper` because of Yoast's naming conventions for classes,
 * which would otherwise break dependency injection in some cases.
 */
class Wordpress_Helper {

	/**
	 * Returns the WordPress version.
	 *
	 * @return string The version.
	 */
	public function get_wordpress_version() {
		global $wp_version;

		return $wp_version;
	}
}
