<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Robots_Validator
 */
class WPSEO_Robots_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the passed request data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'is_robots_nofollow' ) && ! WPSEO_Validator::is_boolean( $request_data['is_robots_nofollow'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $nofollow, 'is_robots_nofollow' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'is_robots_noarchive' ) && ! WPSEO_Validator::is_boolean( $request_data['is_robots_noarchive'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $request_data['is_robots_noarchive'], 'is_robots_noarchive' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'is_robots_noimageindex' ) && ! WPSEO_Validator::is_boolean( $request_data['is_robots_noimageindex'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $request_data['is_robots_noimageindex'], 'is_robots_noimageindex' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'is_robots_nosnippet' ) && ! WPSEO_Validator::is_boolean( $request_data['is_robots_nosnippet'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $request_data['is_robots_nosnippet'], 'is_robots_nosnippet' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'is_robots_noindex' ) && ! WPSEO_Validator::is_boolean( $request_data['is_robots_noindex'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $request_data['is_robots_noindex'], 'is_robots_noindex' );
		}
	}
}
