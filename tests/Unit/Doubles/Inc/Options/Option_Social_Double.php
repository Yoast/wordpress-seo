<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options;

use WPSEO_Option_Social;

/**
 * Test Helper Class.
 */
class Option_Social_Double extends WPSEO_Option_Social {

	/**
	 * Adds all the actions and filters for the option.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * All concrete classes must contain a validate_option() method which validates all values within the option.
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
}
