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
		return WPSEO_Utils::get_site_name();
	}

}
