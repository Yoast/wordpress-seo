<?php

/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */
/**
 * Test Helper Class.
 */
class WPSEO_Option_Social_Double extends \WPSEO_Option_Social {

	/**
	 * Add all the actions and filters for the option.
	 *
	 * @return \WPSEO_Option
	 */
	public function __construct() {
		return parent::__construct();
	}


	/**
	 * All concrete classes must contain a validate_option() method which validates all
	 * values within the option.
	 *
	 * @param array $dirty New value for the option.
	 * @param array $clean Clean value for the option, normally the defaults.
	 * @param array $old   Old value of the option.
	 */
	public function validate_option( $dirty, $clean, $old ) {
		return parent::validate_option( $dirty, $clean, $old );
	}

}


