<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for WordPress matters.
 */
class WordPress_Helper {

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
