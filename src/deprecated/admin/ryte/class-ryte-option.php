<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class handles the data for the option where the Ryte data is stored.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class WPSEO_Ryte_Option {

	/**
	 * Indicates the data is not fetched.
	 *
	 * @deprecated 19.6
	 * @var int
	 */
	const NOT_FETCHED = 0;

	/**
	 * Indicates the option is indexable.
	 *
	 * @deprecated 19.6
	 * @var int
	 */
	const IS_INDEXABLE = 0;

	/**
	 * Indicates the option is not indexable.
	 *
	 * @deprecated 19.6
	 * @var int
	 */
	const IS_NOT_INDEXABLE = 0;

	/**
	 * Indicates the data could not be fetched.
	 *
	 * @deprecated 19.6
	 * @var int
	 */
	const CANNOT_FETCH = -1;

	/**
	 * The name of the option where data will be stored.
	 *
	 * @deprecated 19.6
	 * @var string
	 */
	const OPTION_NAME = '';

	/**
	 * The key of the status in the option.
	 *
	 * @deprecated 19.6
	 * @var string
	 */
	const STATUS = '';

	/**
	 * The key of the last fetch date in the option.
	 *
	 * @deprecated 19.6
	 * @var string
	 */
	const LAST_FETCH = '';

	/**
	 * The limit for fetching the status manually.
	 *
	 * @deprecated 19.6
	 * @var int
	 */
	const FETCH_LIMIT = 0;

	/**
	 * Setting the object by setting the properties.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Getting the status from the option.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return int|string
	 */
	public function get_status() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return -1;
	}

	/**
	 * Saving the status to the options.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param string $status The status to save.
	 */
	public function set_status( $status ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Saving the last fetch timestamp to the options.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param int $timestamp Timestamp with the new value.
	 */
	public function set_last_fetch( $timestamp ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Determines whether the indexability status should be fetched.
	 *
	 * If LAST_FETCH isn't set, we assume the indexability status hasn't been fetched
	 * yet and return true. Then, we check whether the last fetch is within the
	 * FETCH_LIMIT time interval (15 seconds) to avoid too many consecutive API calls.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the indexability status should be fetched.
	 */
	public function should_be_fetched() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return false;
	}

	/**
	 * Saving the option with the current data.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 */
	public function save_option() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Returns the value of the onpage_enabled status.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_enabled() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return false;
	}
}
