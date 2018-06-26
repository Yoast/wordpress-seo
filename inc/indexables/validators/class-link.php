<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class WPSEO_Link_Validator {

	/**
	 * Link validator constructor.
	 *
	 * @param array $data The data to validate.
	 *
	 * @throws Exception
	 */
	public static function validate( $data ) {
		if ( WPSEO_Validator::key_exists( $data, 'count' ) && ! WPSEO_Validator::is_integer( $data['count'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $data['count'], 'count' );
		}

		if ( ! WPSEO_Validator::is_integer( $data['incoming_count'] ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $data['incoming_count'], 'incoming_count' );
		}
	}
}
