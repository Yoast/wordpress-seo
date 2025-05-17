<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use WPSEO_Import_Settings;

/**
 * Test Helper Class.
 */
final class Import_Settings_Double extends WPSEO_Import_Settings {

	/**
	 * Parse the options.
	 *
	 * @param string $raw_options The content to parse.
	 *
	 * @return void
	 */
	public function parse_options( $raw_options ) {
		parent::parse_options( $raw_options );
	}
}
