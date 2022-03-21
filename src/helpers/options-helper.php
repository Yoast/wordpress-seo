<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Option_Titles;
use Yoast\WP\SEO\Exceptions\Option\Missing_Configuration_Key_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception;
use Yoast\WP\SEO\Services\Options\Site_Options_Service;

/**
 * A helper object for options.
 */
class Options_Helper {

	/**
	 * Holds the Site_Options_Service instance.
	 *
	 * @var Site_Options_Service
	 */
	protected $site_options_service;

	/**
	 * Constructs the Site_Options_Service instance.
	 *
	 * @param Site_Options_Service $site_options_service The site options service.
	 */
	public function __construct( Site_Options_Service $site_options_service ) {
		$this->site_options_service = $site_options_service;
	}

	/**
	 * Retrieves a single field from any option for the SEO plugin. Keys are always unique.
	 *
	 * @param string $key      The key it should return.
	 * @param mixed  $fallback The fallback value that should be returned if the key isn't set.
	 *
	 * @return mixed|null Returns value if found, $default_value if not.
	 */
	public function get( $key, $fallback = null ) {
		try {
			return $this->site_options_service->__get( $key );
		} catch ( Unknown_Exception $exception ) {
			return $fallback;
		}
	}

	/**
	 * Sets a single field to the options.
	 *
	 * @param string $key   The key to set.
	 * @param mixed  $value The value to set.
	 *
	 * @return bool Whether the save was successful.
	 */
	public function set( $key, $value ) {
		try {
			$this->site_options_service->__set( $key, $value );

			return true;
		} catch ( Missing_Configuration_Key_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		} catch ( Unknown_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		} catch ( Abstract_Validation_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		}

		return false;
	}

	/**
	 * Retrieves the default value of an option.
	 *
	 * @param string $key The key of the option.
	 *
	 * @return mixed|null The default value, or null if the key does not exist.
	 */
	public function get_default( $key ) {
		try {
			return $this->site_options_service->get_default( $key );
		} catch ( Unknown_Exception $exception ) {
			return null;
		}
	}

	/**
	 * Retrieves the options.
	 *
	 * @param string[] $keys Optionally request only these options.
	 *
	 * @return array The options.
	 */
	public function get_options( array $keys = [] ) {
		return $this->site_options_service->get_options( $keys );
	}

	/**
	 * Saves the options if the database row does not exist.
	 *
	 * @return void
	 */
	public function ensure_options() {
		$this->site_options_service->ensure_options();
	}

	/**
	 * Saves the options with their default values.
	 *
	 * @return void
	 */
	public function reset_options() {
		$this->site_options_service->reset_options();
	}

	/**
	 * Retrieves the title separator.
	 *
	 * @return string The title separator.
	 */
	public function get_title_separator() {
		$default = $this->get_default( 'separator' );

		// Get the titles option and the separator options.
		$separator         = $this->get( 'separator' );
		$separator_options = $this->get_separator_options();

		// This should always be set, but just to be sure.
		if ( isset( $separator_options[ $separator ] ) ) {
			// Set the new replacement.
			$replacement = $separator_options[ $separator ];
		}
		elseif ( isset( $separator_options[ $default ] ) ) {
			$replacement = $separator_options[ $default ];
		}
		else {
			$replacement = \reset( $separator_options );
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
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return array
	 */
	protected function get_separator_options() {
		return WPSEO_Option_Titles::get_instance()->get_separator_options();
	}
}
