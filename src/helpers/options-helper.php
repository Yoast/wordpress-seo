<?php
/**
 * A helper object for options.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

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
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return mixed|null Returns value if found, $default if not.
	 */
	public function get( $key, $default = null ) {
		return WPSEO_Options::get( $key, $default );
	}

	/**
	 * Sets a single field to the options.
	 *
	 * @param string $key   The key to set.
	 * @param mixed  $value The value to set.
	 *
	 * @return mixed|null Returns value if found, $default if not.
	 */
	public function set( $key, $value ) {
		return WPSEO_Options::set( $key, $value );
	}

	/**
	 * Retrieves a default value from the option titles.
	 *
	 * @param string $option_titles_key The key of the option title you wish to get.
	 *
	 * @return string The option title.
	 */
	public function get_title_default( $option_titles_key ) {
		$default_titles = $this->get_title_defaults();
		if ( ! empty( $default_titles[ $option_titles_key ] ) ) {
			return $default_titles[ $option_titles_key ];
		}

		return '';
	}

	/**
	 * Retrieves the default option titles.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return array The title defaults.
	 */
	protected function get_title_defaults() {
		return WPSEO_Option_Titles::get_instance()->get_defaults();
	}
}
