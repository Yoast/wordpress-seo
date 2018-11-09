<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Invalid_Argument_Exception
 */
class WPSEO_Invalid_Argument_Exception extends InvalidArgumentException {

	/**
	 * Creates an invalid empty parameter exception.
	 *
	 * @param string $name The name of the parameter.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function empty_parameter( $name ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the parameter name. */
				__( 'The parameter `%1$s` cannot be empty.', 'wordpress-seo' ),
				$name
			)
		);
	}

	/**
	 * Creates an invalid parameter exception.
	 *
	 * @param mixed  $parameter The parameter value of the field.
	 * @param string $name      The name of the field.
	 * @param string $expected  The expected type.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_parameter_type( $parameter, $name, $expected ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the parameter name. %2$s expands to the expected type and %3$s expands to the expected type. */
				__( 'Invalid type for parameter `%1$s` passed. Expected `%2$s`, but got `%3$s`', 'wordpress-seo' ),
				$name,
				$expected,
				gettype( $parameter )
			)
		);
	}

	/**
	 * Creates an invalid integer parameter exception.
	 *
	 * @param mixed  $parameter The parameter value of the field.
	 * @param string $name      The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_integer_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'integer' );
	}

	/**
	 * Creates an invalid string parameter exception.
	 *
	 * @param mixed  $parameter The parameter value of the field.
	 * @param string $name      The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_string_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'string' );
	}

	/**
	 * Creates an invalid boolean parameter exception.
	 *
	 * @param mixed  $parameter The parameter value of the field.
	 * @param string $name      The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_boolean_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'boolean' );
	}

	/**
	 * Creates an invalid callable parameter exception.
	 *
	 * @param mixed  $parameter The parameter value of the field.
	 * @param string $name      The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_callable_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'callable' );
	}

	/**
	 * Creates an invalid object type exception.
	 *
	 * @param string $type The type of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_type( $type ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the object type. */
				__( 'The object type `%1$s` is invalid', 'wordpress-seo' ),
				$type
			)
		);
	}

	/**
	 * Creates an invalid object subtype exception.
	 *
	 * @param string $subtype The invalid subtype.
	 * @param string $type    The parent type of the subtype.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_subtype( $subtype, $type ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the object subtype. %2$s resolved to the object type. */
				__( '`%1$s` is not a valid subtype of `%2$s`', 'wordpress-seo' ),
				$subtype,
				$type
			)
		);
	}

	/**
	 * Creates an unknown object exception.
	 *
	 * @param int    $id   The ID that was searched for.
	 * @param string $type The type of object that was being searched for.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function unknown_object( $id, $type ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the object ID. %2$s resolved to the object type. */
				__( 'No object with ID %1$s and %2$s could be found', 'wordpress-seo' ),
				$id,
				$type
			)
		);
	}
}
