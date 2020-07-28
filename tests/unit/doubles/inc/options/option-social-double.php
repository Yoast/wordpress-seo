<?php

namespace Yoast\WP\SEO\Tests\Doubles\Inc\Options;

use WPSEO_Option;
use WPSEO_Option_Social;

/**
 * Test Helper Class.
 */
class Option_Social_Double extends WPSEO_Option_Social {

	/**
	 * Adds all the actions and filters for the option.
	 *
	 * @return WPSEO_Option
	 */
	public function __construct() {
		return parent::__construct();
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

	/**
	 * Validates a Facebook App ID.
	 *
	 * @param string $key   Key to check, in this case: the Facebook App ID field name.
	 * @param array  $dirty Dirty data with the new values.
	 * @param array  $old   Old data.
	 * @param array  $clean Clean data by reference, normally the default values.
	 */
	public function validate_facebook_app_id( $key, $dirty, $old, &$clean ) {
		return parent::validate_facebook_app_id( $key, $dirty, $old, $clean );
	}
}
