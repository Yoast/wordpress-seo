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
 * @deprecated 14.0
 *
 * @since 1.8
 */
class WPSEO_Schema implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @since 10.2
	 *
	 * @return void
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}
}
