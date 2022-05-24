<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Option_Social;
use WPSEO_Option_Titles;
use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Form_Invalid_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Services\Options\Site_Options_Service;

/**
 * A helper object for options.
 */
class Options_Helper {

	const INVALID_VALUE = 'YOAST_INVALID_VALUE';

	/**
	 * Holds the Site_Options_Service instance.
	 *
	 * @var Site_Options_Service
	 */
	protected $site_options_service;

	/**
	 * Holds the Multisite_Options_Service instance.
	 *
	 * @var Multisite_Options_Service
	 */
	protected $multisite_options_service;

	/**
	 * Holds the Network_Admin_Options_Service instance.
	 *
	 * @var Network_Admin_Options_Service
	 */
	protected $network_admin_options_service;

	/**
	 * Holds the Site_Helper instance.
	 *
	 * @var Site_Helper
	 */
	protected $site_helper;

	/**
	 * Sets the dependencies.
	 *
	 * This method is used instead of the constructor to avoid a circular dependency:
	 * Site_Options_Service -> Post_Type_Helper -> Options_Helper.
	 *
	 * @param Site_Options_Service          $site_options_service          The site options service.
	 * @param Multisite_Options_Service     $multisite_options_service     The multisite options service.
	 * @param Network_Admin_Options_Service $network_admin_options_service The network admin options service.
	 * @param Site_Helper                   $site_helper                   The site helper.
	 *
	 * @required
	 */
	public function set_dependencies(
		Site_Options_Service $site_options_service,
		Multisite_Options_Service $multisite_options_service,
		Network_Admin_Options_Service $network_admin_options_service,
		Site_Helper $site_helper
	) {
		$this->site_options_service          = $site_options_service;
		$this->multisite_options_service     = $multisite_options_service;
		$this->network_admin_options_service = $network_admin_options_service;
		$this->site_helper                   = $site_helper;
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
			return $this->get_options_service()->__get( $key );
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
			$this->get_options_service()->__set( $key, $value );

			return true;
		} catch ( Unknown_Exception $exception ) {
			return false;
		} catch ( Abstract_Validation_Exception $exception ) {
			return false;
		} catch ( Save_Failed_Exception $exception ) {
			return false;
		}
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
			return $this->get_options_service()->get_default( $key );
		} catch ( Unknown_Exception $exception ) {
			return null;
		}
	}

	/**
	 * Validates an option value.
	 *
	 * @param string $key   The option key.
	 * @param mixed  $value The option value.
	 *
	 * @return mixed The valid value, or self::INVALID_VALUE if unknown or unfixable.
	 */
	public function validate( $key, $value ) {
		try {
			return $this->get_options_service()->validate( $key, $value );
		} catch ( Unknown_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		} catch ( Abstract_Validation_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		}

		return self::INVALID_VALUE;
	}

	/**
	 * Retrieves the options.
	 *
	 * @param string[] $keys Optionally request only these options.
	 *
	 * @return array The options.
	 */
	public function get_options( array $keys = [] ) {
		return $this->get_options_service()->get_options( $keys );
	}

	/**
	 * Sets the options.
	 *
	 * @param array $options The options.
	 *
	 * @return array The result, containing `success` and `error` keys.
	 */
	public function set_options( array $options ) {
		$result          = [ 'success' => false ];
		$options_service = $this->get_options_service();

		try {
			$options_service->set_options( $options );
			$result['success'] = true;
		} catch ( Save_Failed_Exception $exception ) {
			$result['error'] = $exception;
		} catch ( Form_Invalid_Exception $exception ) {
			$result['error'] = $exception;
		}

		return $result;
	}

	/**
	 * Saves the options if the database row does not exist.
	 *
	 * @return bool Whether the ensure succeeded.
	 */
	public function ensure_options() {
		try {
			$this->get_options_service()->ensure_options();

			return true;
		} catch ( Save_Failed_Exception $e ) {
			return false;
		}
	}

	/**
	 * Saves the options with their default values.
	 *
	 * @return bool Whether the reset succeeded.
	 */
	public function reset_options() {
		try {
			$this->get_options_service()->reset_options();

			return true;
		} catch ( Delete_Failed_Exception $e ) {
			return false;
		} catch ( Save_Failed_Exception $e ) {
			return false;
		}
	}

	/**
	 * Clears the cache.
	 *
	 * @return void
	 */
	public function clear_cache() {
		// Ensure the cache of all the used services are cleared.
		if ( $this->site_helper->is_multisite() ) {
			$this->network_admin_options_service->clear_cache();
			$this->multisite_options_service->clear_cache();

			return;
		}
		$this->site_options_service->clear_cache();
	}

	/**
	 * Retrieves the appropriate options service for the current location.
	 *
	 * @return Site_Options_Service|Multisite_Options_Service The options service.
	 */
	public function get_options_service() {
		if ( $this->site_helper->is_multisite() ) {
			return $this->multisite_options_service;
		}

		return $this->site_options_service;
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
