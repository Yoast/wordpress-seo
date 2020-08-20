<?php
/**
 * A helper object for site options.
 *
 * @package Yoast\WP\SEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;

/**
 * Class Site_Helper
 */
class Site_Helper {

	/**
	 * Retrieves the site name.
	 *
	 * @return string
	 */
	public function get_site_name() {
		return wp_strip_all_tags( get_bloginfo( 'name' ), true );
	}

	/**
	 * Checks if the current installation is a multisite and there has been a switch
	 * between the set multisites.
	 *
	 * @codeCoverageIgnore It wraps WordPress functions.
	 *
	 * @return bool True when there was a switch between the multisites.
	 */
	public function is_multisite_and_switched() {
		return \is_multisite() && \ms_is_switched();
	}
}
