<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Keyword_Validator.
 */
class WPSEO_Keyword_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the keyword-related data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the keyword or the score is of an invalid value type.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'keyword' ) && ! WPSEO_Validator::is_string( $request_data['keyword'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['keyword'], 'keyword' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'score' ) && ! WPSEO_Validator::is_integer( $request_data['score'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $request_data['score'], 'score' );
		}
	}
}
