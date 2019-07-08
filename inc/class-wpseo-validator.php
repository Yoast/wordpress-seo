<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Validator.
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
		if ( is_bool( $variable ) ) {
			return true;
		}

		return filter_var( $variable, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE ) !== null;
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

	/**
	 * Determines whether a particular key exists within the passed dataset.
	 *
	 * @param array  $data The dataset to search through.
	 * @param string $key  The key to search for.
	 *
	 * @return bool Whether or not the key exists.
	 */
	public static function key_exists( array $data, $key ) {
		return array_key_exists( $key, $data );
	}
}
