<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Option_Social;
use WPSEO_Option_Titles;
use WPSEO_Options;

/**
 * A helper object for options.
 */
class Options_Helper {

	/**
	 * Retrieves a single field from any option for the SEO plugin. Keys are always unique.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @param string $key           The key it should return.
	 * @param mixed  $default_value The default value that should be returned if the key isn't set.
	 *
	 * @return mixed|null Returns value if found, $default_value if not.
	 */
	public function get( $key, $default_value = null ) {
		return WPSEO_Options::get( $key, $default_value );
	}

	/**
	 * Sets a single field to the options.
	 *
	 * @param string $key   The key to set.
	 * @param mixed  $value The value to set.
	 *
	 * @return mixed|null Returns value if found.
	 */
	public function set( $key, $value ) {
		return WPSEO_Options::set( $key, $value );
	}

	/**
	 * Get a specific default value for an option.
	 *
	 * @param string $option_name The option for which you want to retrieve a default.
	 * @param string $key         The key within the option who's default you want.
	 *
	 * @return mixed The default value.
	 */
	public function get_default( $option_name, $key ) {
		return WPSEO_Options::get_default( $option_name, $key );
	}

	/**
	 * Retrieves the title separator.
	 *
	 * @return string The title separator.
	 */
	public function get_title_separator() {
		$default = $this->get_default( 'wpseo_titles', 'separator' );

		// Get the titles option and the separator options.
		$separator         = $this->get( 'separator' );
		$seperator_options = $this->get_separator_options();

		// This should always be set, but just to be sure.
		if ( isset( $seperator_options[ $separator ] ) ) {
			// Set the new replacement.
			$replacement = $seperator_options[ $separator ];
		}
		elseif ( isset( $seperator_options[ $default ] ) ) {
			$replacement = $seperator_options[ $default ];
		}
		else {
			$replacement = \reset( $seperator_options );
		}

		/**
		 * Filter: 'wpseo_replacements_filter_sep' - Allow customization of the separator character(s).
		 *
		 * @api string $replacement The current separator.
		 */
		return \apply_filters( 'wpseo_replacements_filter_sep', $replacement );
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

	/**
	 * Get the available separator options.
	 *
	 * @return array
	 */
	protected function get_separator_options() {
		return WPSEO_Option_Titles::get_instance()->get_separator_options();
	}

	/**
	 * Validates a social URL.
	 *
	 * @param string $url The url to be validated.
	 *
	 * @return string|false The validated URL or false if the URL is not valid.
	 */
	public function validate_social_url( $url ) {
		return empty( $url ) || WPSEO_Option_Social::get_instance()->validate_social_url( $url );
	}

	/**
	 * Validates a twitter id.
	 *
	 * @param string $twitter_id    The twitter id to be validated.
	 * @param bool   $strip_at_sign Whether or not to strip the `@` sign.
	 *
	 * @return string|false The validated twitter id or false if it is not valid.
	 */
	public function validate_twitter_id( $twitter_id, $strip_at_sign = true ) {
		return WPSEO_Option_Social::get_instance()->validate_twitter_id( $twitter_id, $strip_at_sign );
	}
}
