<?php
/**
 * @package WPSEO\Premium\Classes\Redirect\Loaders
 */

/**
 * Base class for loading redirects from an external source and validating them.
 */
abstract class WPSEO_Redirect_Abstract_Loader {

	/**
	 * Loads the redirects from an external source and validates them.
	 *
	 * @return array An array of WPSEO_Redirect_Load_Results.
	 */
	abstract public function load();

	/**
	 * Validates if the given value is a http status code.
	 *
	 * @param string|int $status_code The status code to validate.
	 *
	 * @return bool Whether or not the status code is valid.
	 */
	protected function validate_status_code( $status_code ) {
		if ( is_string( $status_code ) ) {
			if ( ! preg_match( '/\A\d+\Z/', $status_code, $matches ) ) {
				return false;
			}
			$status_code = (int) $status_code;
		}

		$status_codes = new WPSEO_Redirect_Types();
		if ( ! in_array( $status_code, array_keys( $status_codes->get() ), true ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Validates if the given value is a redirect format.
	 *
	 * @param string $format The format to validate.
	 *
	 * @return bool Whether or not the format is valid.
	 */
	protected function validate_format( $format ) {
		$permitted_formats = array( WPSEO_Redirect::FORMAT_PLAIN, WPSEO_Redirect::FORMAT_REGEX );
		if ( ! in_array( $format, $permitted_formats , true ) ) {
			return false;
		}

		return true;
	}
}
