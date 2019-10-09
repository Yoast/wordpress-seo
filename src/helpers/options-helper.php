<?php
/**
 * A helper object for options.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WPSEO_Option_Titles;
use WPSEO_Options;

/**
 * Class Options_Helper
 */
class Options_Helper {

	/**
	 * Retrieves a single field from any option for the SEO plugin. Keys are always unique.
	 *
	 * @param string $key     The key it should return.
	 * @param mixed  $default The default value that should be returned if the key isn't set.
	 *
	 * @return mixed|null Returns value if found, $default if not.
	 */
	public function get( $key, $default = null ) {
		return WPSEO_Options::get( $key, $default );
	}

	/**
	 * Retrieves the defaults of the title options.
	 *
	 * @return array The title option defaults.
	 */
	public function get_title_defaults() {
		return WPSEO_Option_Titles::get_instance()->get_defaults();
	}
}
