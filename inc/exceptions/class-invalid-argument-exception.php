<?php

/**
 * Class WPSEO_Invalid_Argument_Exception
 */
class WPSEO_Invalid_Argument_Exception extends \InvalidArgumentException {

	/**
	 * Creates an invalid empty parameter exeception.
	 *
	 * @param string $name The name of the parameter.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function empty_parameter( $name ) {
		return new static(
			sprintf( '`%s` cannot be empty.', $name )
		);
	}

	/**
	 * Creates an invalid parameter exception.
	 *
	 * @param mixed $parameter The parameter value of the field.
	 * @param string $name	   The name of the field.
	 * @param string $expected The expected type.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_parameter_type( $parameter, $name, $expected ) {
		return new static(
			sprintf(
				'Invalid type for `%s` passed. Expected `%s`, but got `%s`',
				$name,
				$expected,
				gettype( $parameter )
			)
		);
	}

	/**
 	 * Creates an invalid integer parameter exception.
	 *
	 * @param mixed $parameter The parameter value of the field.
	 * @param string $name	   The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_integer_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'integer' );
	}

	/**
	 * Creates an invalid string parameter exception.
	 *
	 * @param mixed $parameter The parameter value of the field.
	 * @param string $name	   The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_string_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'string' );
	}

	/**
	 * Creates an invalid boolean parameter exception.
	 *
	 * @param mixed $parameter The parameter value of the field.
	 * @param string $name	   The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_boolean_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'boolean' );
	}

	/**
	 * Creates an invalid callable parameter exception.
	 *
	 * @param mixed $parameter The parameter value of the field.
	 * @param string $name	   The name of the field.
	 *
	 * @return WPSEO_Invalid_Argument_Exception The exception.
	 */
	public static function invalid_callable_parameter( $parameter, $name ) {
		return self::invalid_parameter_type( $parameter, $name, 'callable' );
	}
}
