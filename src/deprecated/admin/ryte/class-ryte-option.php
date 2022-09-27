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
	 * @var int
	 */
	const NOT_FETCHED = 99;

	/**
	 * Indicates the option is indexable.
	 *
	 * @var int
	 */
	const IS_INDEXABLE = 1;

	/**
	 * Indicates the option is not indexable.
	 *
	 * @var int
	 */
	const IS_NOT_INDEXABLE = 0;

	/**
	 * Indicates the data could not be fetched.
	 *
	 * @var int
	 */
	const CANNOT_FETCH = -1;

	/**
	 * The name of the option where data will be stored.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'wpseo_ryte';

	/**
	 * The key of the status in the option.
	 *
	 * @var string
	 */
	const STATUS = 'status';

	/**
	 * The key of the last fetch date in the option.
	 *
	 * @var string
	 */
	const LAST_FETCH = 'last_fetch';

	/**
	 * The limit for fetching the status manually.
	 *
	 * @var int
	 */
	const FETCH_LIMIT = 15;

	/**
	 * The Ryte option stored in the database.
	 *
	 * @var array
	 */
	private $ryte_option;

	/**
	 * Setting the object by setting the properties.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		$this->ryte_option = $this->get_option();
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
		if ( array_key_exists( self::STATUS, $this->ryte_option ) ) {
			return $this->ryte_option[ self::STATUS ];
		}

		return self::CANNOT_FETCH;
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
		$this->ryte_option[ self::STATUS ] = $status;
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
		$this->ryte_option[ self::LAST_FETCH ] = $timestamp;
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
		if ( ! isset( $this->ryte_option[ self::LAST_FETCH ] ) ) {
			return true;
		}

		return ( ( time() - $this->ryte_option[ self::LAST_FETCH ] ) > self::FETCH_LIMIT );
	}

	/**
	 * Saving the option with the current data.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 */
	public function save_option() {
		update_option( self::OPTION_NAME, $this->ryte_option );
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
		return WPSEO_Options::get( 'ryte_indexability' );
	}

	/**
	 * Getting the option with the Ryte data.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	private function get_option() {
		$default = [
			self::STATUS     => self::NOT_FETCHED,
			self::LAST_FETCH => 0,
		];

		return get_option( self::OPTION_NAME, $default );
	}
}
