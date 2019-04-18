<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_OpenGraph_Validator.
 */
class WPSEO_OpenGraph_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the OpenGraph-related data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if one of the OpenGraph properties is of an invalid value type.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'og_title' ) && ! WPSEO_Validator::is_string( $request_data['og_title'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['og_title'], 'og_title' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'og_description' ) && ! WPSEO_Validator::is_string( $request_data['og_description'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['og_description'], 'og_description' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'og_image' ) && ! WPSEO_Validator::is_string( $request_data['og_image'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['og_image'], 'og_image' );
		}
	}
}
