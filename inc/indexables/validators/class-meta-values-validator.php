<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Meta_Values_Validator
 */
class WPSEO_Meta_Values_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the meta values data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if a field from the request data is of an invalid value type.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'title' ) && ! WPSEO_Validator::is_string( $request_data['title'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['title'], 'title' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'metadesc' ) && ! WPSEO_Validator::is_string( $request_data['metadesc'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['metadesc'], 'metadesc' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'permalink' ) && ! WPSEO_Validator::is_string( $request_data['permalink'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['permalink'], 'permalink' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'readability_score' ) && ! WPSEO_Validator::is_integer( $request_data['readability_score'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $request_data['readability_score'], 'readability_score' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'is_cornerstone' ) && ! WPSEO_Validator::is_boolean( $request_data['is_cornerstone'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $request_data['is_cornerstone'], 'is_cornerstone' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'canonical' ) && ! WPSEO_Validator::is_string( $request_data['canonical'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['canonical'], 'canonical' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'breadcrumb_title' ) && ! WPSEO_Validator::is_string( $request_data['breadcrumb_title'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['breadcrumb_title'], 'breadcrumb_title' );
		}
	}
}
