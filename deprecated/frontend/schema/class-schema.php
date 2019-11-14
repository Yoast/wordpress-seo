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
 * @deprecated xx.x
 *
 * @since 1.8
 */
class WPSEO_Schema implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @since 10.2
	 *
	 * @return void
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}
}
