<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 7.0' );

/**
 * Option: wpseo_permalinks.
 *
 * @deprecated 7.0
 */
class WPSEO_Option_Permalinks {

	/**
	 * @var  string  option name
	 */
	public $option_name = '';

	/**
	 * Catch all other calls to this deprecated class.
	 *
	 * @param string $method The method to 'call'.
	 * @param array  $args   Possibly given arguments.
	 */
	public function __call( $method, array $args = array() ) {
		_deprecated_function( $method, 'WPSEO 7.0' );
	}

	/**
	 * Add the actions and filters for the option
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	protected function __construct() {
		_deprecated_constructor( __CLASS__, 'WPSEO 7.0' );
	}

	/**
	 * Get the singleton instance of this class
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	public static function get_instance() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Validate the option
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	protected function validate_option() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}
}
