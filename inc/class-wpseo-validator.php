<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class WPSEO_Validator {

	/**
	 * Validates whether the passed variable is a boolean.
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed variable is a valid boolean.
	 */
	public static function is_boolean( $variable ) {
		return filter_var( $variable, FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Validates whether the passed variable is a string.
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed variable is a string.
	 */
	public static function is_string( $variable ) {
		return is_string( $variable );
	}

	/**
	 * Validates whether the passed variable is a non-empty string.
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed value is a non-empty string.
	 */
	public static function is_non_empty_string( $variable ) {
		return self::is_string( $variable ) && $variable !== '';
	}

	/**
	 * Validates whether the passed variable is an integer.
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed variable is an integer.
	 */
	public static function is_integer( $variable ) {
		return filter_var( $variable, FILTER_VALIDATE_INT ) || filter_var( $variable, FILTER_VALIDATE_INT ) === 0;
	}
}
