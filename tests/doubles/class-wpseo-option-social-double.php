<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Class WPSEO_Option_Social_Double.
 */
class WPSEO_Option_Social_Double extends WPSEO_Option_Social {

	/**
	 * Exposes the constructor.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Validate the option.
	 *
	 * @param array $dirty New value for the option.
	 * @param array $clean Clean value for the option, normally the defaults.
	 * @param array $old   Old value of the option.
	 *
	 * @return array Validated clean value for the option to be saved to the database.
	 */
	public function validate_option( $dirty, $clean, $old ) {
		return parent::validate_option( $dirty, $clean, $old );
	}

	/**
	 * Validates an option as a valid URL. Prints out a WordPress settings error
	 * notice if the URL is invalid.
	 *
	 * @param string $key   Key to check, by type of service.
	 * @param array  $dirty Dirty data with the new values.
	 * @param array  $old   Old data.
	 * @param array  $clean Clean data by reference, normally the default values.
	 */
	public function validate_url( $key, $dirty, $old, &$clean ) {
		return parent::validate_url( $key, $dirty, $old, $clean );
	}
}
