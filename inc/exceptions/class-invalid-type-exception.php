<?php

/**
 * Class WPSEO_Invalid_Type_Exception
 */
class WPSEO_Invalid_Type_Exception extends \InvalidArgumentException {

	/**
	 * Creates an invalid parameter exception.
	 *
	 * @param mixed $parameter The parameter value of the field.
	 * @param string $name	   The name of the field.
	 * @param string $expected The expected type.
	 *
	 * @return WPSEO_Invalid_Type_Exception The exception.
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
}
