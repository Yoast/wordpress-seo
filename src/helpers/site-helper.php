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
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return string
	 */
	public function get_site_name() {
		return WPSEO_Utils::get_site_name();
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
		return is_multisite() && ms_is_switched();
	}

}
