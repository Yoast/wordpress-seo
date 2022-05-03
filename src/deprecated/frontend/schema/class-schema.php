<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema
 *
 * Outputs schema code specific for Google's JSON LD stuff.
 *
 * @since      1.8
 * @deprecated 14.0
 */
class WPSEO_Schema implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since      10.2
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}
}
