<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Link_Validator.
 */
class WPSEO_Link_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the link-related data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the link-data count or incoming count is of an invalid value type.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'count' ) && ! WPSEO_Validator::is_integer( $request_data['count'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $request_data['count'], 'count' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'incoming_count' ) && ! WPSEO_Validator::is_integer( $request_data['incoming_count'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $request_data['incoming_count'], 'incoming_count' );
		}
	}
}
