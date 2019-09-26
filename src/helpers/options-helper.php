<?php
/**
 * A helper object for redirects.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

/**
 * Class Redirect_Helper
 */
class Options_Helper {

	/**
	 * Retrieve a single field from any option for the SEO plugin. Keys are always unique.
	 *
	 * @param string $key     The key it should return.
	 * @param mixed  $default The default value that should be returned if the key isn't set.
	 *
	 * @return mixed|null Returns value if found, $default if not.
	 */
	public function get( $key, $default = null ) {
		return \WPSEO_Options::get( $key, $default );
	}
}
