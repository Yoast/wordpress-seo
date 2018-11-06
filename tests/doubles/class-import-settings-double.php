<?php
/**
 * WPSEO plugin test double file.
 *
 * @package WPSEO\Tests\Doubles
 */

class WPSEO_Import_Settings_Double extends WPSEO_Import_Settings {
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
