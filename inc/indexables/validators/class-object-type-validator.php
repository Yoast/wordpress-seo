<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class WPSEO_Object_Type_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * Validates the object_type parameter.
	 *
	 * @param string $object_type The object type to validate.
	 *
	 * @return void
	 */
	private function validate_type( $object_type ) {
		if ( ! in_array( $object_type, array( 'post', 'term' ), true ) ) {
			throw new \InvalidArgumentException( 'Invalid object type passed' );
		}

		if ( ! WPSEO_Validator::is_string( $object_type ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $object_type, 'object_type' );
		}
	}

	/**
	 * Validates whether the passed subtype is valid or not.
	 *
	 * @param string $subtype The subtype to validate.
	 *
	 * @return void
	 * @throws Exception
	 */
	private function validate_subtype( $subtype ) {
		if ( $this->type === 'post' && ! post_type_exists( $subtype ) ) {
			throw new \InvalidArgumentException( 'Invalid post subtype passed' );
		}

		if ( $this->type === 'term' && ! taxonomy_exists( $subtype ) ) {
			throw new \InvalidArgumentException( 'Invalid term object type passed' );
		}
	}

	/**
	 * Validates the object type-related data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 * @throws Exception
	 */
	public static function validate( $request_data ) {
		if ( WPSEO_Validator::key_exists( $request_data, 'object_type' ) ) {
			self::validate_type( $request_data['object_type'] );
		}

		if ( WPSEO_Validator::key_exists( $request_data, 'object_subtype' ) ) {
			self::validate_subtype( $request_data['object_subtype'] );
		}
	}
}
