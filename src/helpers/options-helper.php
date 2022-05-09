<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Option_Social;
use WPSEO_Option_Titles;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
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
	 * Sets the dependencies.
	 *
	 * This method is used instead of the constructor to avoid a circular dependency:
	 * Site_Options_Service -> Post_Type_Helper -> Options_Helper.
	 *
	 * @param Site_Options_Service $site_options_service The site options service.
	 *
	 * @required
	 */
	public function set_dependencies( Site_Options_Service $site_options_service ) {
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
		} catch ( Unknown_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		} catch ( Abstract_Validation_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		} catch ( Save_Failed_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
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
	 * Clears the cache.
	 *
	 * @return void
	 */
	public function clear_cache() {
		$this->site_options_service->clear_cache();
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

	/**
	 * Validates a social URL.
	 *
	 * @param string $url The url to be validated.
	 *
	 * @return string|false The validated URL or false if the URL is not valid.
	 */
	public function validate_social_url( $url ) {
		return $url === '' || WPSEO_Option_Social::get_instance()->validate_social_url( $url );
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
