<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Twitter_Validator
 */
class WPSEO_Twitter_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the Twitter-related data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if one of the Twitter properties is of an invalid value type.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'twitter_title' ) && ! WPSEO_Validator::is_string( $request_data['twitter_title'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['twitter_title'], 'twitter_title' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'twitter_description' ) && ! WPSEO_Validator::is_string( $request_data['twitter_description'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['twitter_description'], 'twitter_description' );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'twitter_image' ) && ! WPSEO_Validator::is_string( $request_data['twitter_image'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $request_data['twitter_image'], 'twitter_image' );
		}
	}
}
