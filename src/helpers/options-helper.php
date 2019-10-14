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
	 * Retrieves a default title from the title options.
	 *
	 * @param string $title_option The default title you wish to get.
	 *
	 * @return string The default title.
	 */
	public function get_title_default( $title_option ) {
		$default_titles = WPSEO_Option_Titles::get_instance()->get_defaults();
		if ( ! empty( $default_titles[ $title_option ] ) ) {
			return $default_titles[ $title_option ];
		}

		return '';
	}
}
