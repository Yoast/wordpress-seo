<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Object_Type_Validator.
 */
class WPSEO_Object_Type_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the object_type parameter.
	 *
	 * @param string $object_type The object type to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown is the object type is invalid.
	 */
	private static function validate_type( $object_type ) {
		if ( ! in_array( $object_type, array( 'post', 'term' ), true ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_type( $object_type );
		}
	}

	/**
	 * Validates whether the passed subtype is valid or not.
	 *
	 * @param string $type    The type to validate.
	 * @param string $subtype The subtype to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the subtype doesn't exist for the given type.
	 */
	private static function validate_subtype( $type, $subtype ) {
		if ( $type === 'post' && ! post_type_exists( $subtype ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_subtype( $subtype, $type );
		}

		if ( $type === 'term' && ! taxonomy_exists( $subtype ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_subtype( $subtype, $type );
		}
	}

	/**
	 * Validates the object type-related data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the type or subtype are invalid.
	 */
	public function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'object_type' ) ) {
			self::validate_type( $request_data['object_type'] );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'object_subtype' ) ) {
			self::validate_subtype( $request_data['object_type'], $request_data['object_subtype'] );
		}
	}
}
