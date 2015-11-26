<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class handles the data for the option where the OnPage.org data is stored.
 */
class WPSEO_OnPage_Option {

	const NOT_FETCHED      = 99;
	const IS_INDEXABLE     = 1;
	const IS_NOT_INDEXABLE = 0;
	const CANNOT_FETCH     = -1;

	/**
	 *  The name of the option where data will be stored
	 */
	const OPTION_NAME = 'wpseo_onpage';

	/**
	 * The key of the status in the option
	 */
	const STATUS = 'status';

	/**
	 * The key of the last fetch date in the option.
	 */
	const LAST_FETCH = 'last_fetch';

	/**
	 * The limit for fetching the status manually.
	 */
	const FETCH_LIMIT = 15;

	/**
	 * @var array The OnPage.org option stored in the database.
	 */
	private $onpage_option;

	/**
	 * Setting the object by setting the properties
	 */
	public function __construct() {
		$this->onpage_option = $this->get_option();
	}

	/**
	 * Getting the status from the option.
	 *
	 * @return string
	 */
	public function get_status() {
		if ( array_key_exists( self::STATUS, $this->onpage_option ) ) {
			return $this->onpage_option[ self::STATUS ];
		}

		return self::CANNOT_FETCH;
	}

	/**
	 * Saving the status to the options.
	 *
	 * @param string $status The status to save.
	 */
	public function set_status( $status ) {
		$this->onpage_option[ self::STATUS ] = $status;
	}

	/**
	 * Saving the last fetch timestamp to the options.
	 *
	 * @param integer $timestamp Timestamp with the new value.
	 */
	public function set_last_fetch( $timestamp ) {
		$this->onpage_option[ self::LAST_FETCH ] = $timestamp;
	}

	/**
	 * Check if the last fetch is within the time of 60 minutes
	 *
	 * @return bool
	 */
	public function should_be_fetched() {
		return ( ( time() - $this->onpage_option[ self::LAST_FETCH ] ) > self::FETCH_LIMIT );
	}

	/**
	 * Saving the option with the current data
	 */
	public function save_option() {
		update_option( self::OPTION_NAME, $this->onpage_option );
	}

	/**
	 * Returns the value of the onpage_enabled status
	 *
	 * @return bool
	 */
	public function is_enabled() {
		$options = get_option( 'wpseo' );

		return ! empty( $options['onpage_indexability'] );
	}

	/**
	 * Getting the option with the OnPage.org data
	 *
	 * @return array
	 */
	private function get_option() {
		return get_option( self::OPTION_NAME, array( self::STATUS => self::NOT_FETCHED, self::LAST_FETCH => 0 ) );
	}

	/**
	 * @deprecated 3.0.2
	 *
	 * Returns the indexable status of the website.
	 *
	 * @return bool
	 */
	public function is_indexable() {
		_deprecated_function( 'WPSEO_OnPage_Option::is_indexable', 'WPSEO 3.0.2' );

		return self::IS_INDEXABLE === $this->get_status();
	}

}
