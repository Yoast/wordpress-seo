<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Validator.
 *
 * @deprecated 15.6
 */
class WPSEO_Validator {

	/**
	 * Validates whether the passed variable is a boolean.
	 *
	 * @deprecated 15.6
	 * @codeCoverageIgnore
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed variable is a valid boolean.
	 */
	public static function is_boolean( $variable ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.6' );

		if ( is_bool( $variable ) ) {
			return true;
		}

		return filter_var( $variable, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE ) !== null;
	}

	/**
	 * Validates whether the passed variable is a string.
	 *
	 * @deprecated 15.6
	 * @codeCoverageIgnore
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed variable is a string.
	 */
	public static function is_string( $variable ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.6' );

		return is_string( $variable );
	}

	/**
	 * Validates whether the passed variable is a non-empty string.
	 *
	 * @deprecated 15.6
	 * @codeCoverageIgnore
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed value is a non-empty string.
	 */
	public static function is_non_empty_string( $variable ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.6' );

		return self::is_string( $variable ) && $variable !== '';
	}

	/**
	 * Validates whether the passed variable is an integer.
	 *
	 * @deprecated 15.6
	 * @codeCoverageIgnore
	 *
	 * @param mixed $variable The variable to validate.
	 *
	 * @return bool Whether or not the passed variable is an integer.
	 */
	public static function is_integer( $variable ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.6' );

		return filter_var( $variable, FILTER_VALIDATE_INT ) || filter_var( $variable, FILTER_VALIDATE_INT ) === 0;
	}

	/**
	 * Determines whether a particular key exists within the passed dataset.
	 *
	 * @deprecated 15.6
	 * @codeCoverageIgnore
	 *
	 * @param array  $data The dataset to search through.
	 * @param string $key  The key to search for.
	 *
	 * @return bool Whether or not the key exists.
	 */
	public static function key_exists( array $data, $key ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.6' );

		return array_key_exists( $key, $data );
	}
}
