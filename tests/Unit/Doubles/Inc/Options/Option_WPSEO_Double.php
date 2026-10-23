<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options;

use WPSEO_Option_Wpseo;

/**
 * Test Helper Class.
 */
final class Option_WPSEO_Double extends WPSEO_Option_Wpseo {

	/**
	 * Adds all the actions and filters for the option.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Validates all values within the option.
	 *
	 * @param array<string, mixed> $dirty New value for the option.
	 * @param array<string, mixed> $clean Clean value for the option, normally the defaults.
	 * @param array<string, mixed> $old   Old value of the option.
	 *
	 * @return array<string, mixed> Validated clean value for the option to be saved to the database.
	 */
	public function validate_option( $dirty, $clean, $old ) {
		return parent::validate_option( $dirty, $clean, $old );
	}
}
