<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator class for the regular expressions.
 */
class WPSEO_Redirect_URL_Validator extends WPSEO_Redirect_Validator {

	/**
	 * Validates the old and the new url
	 *
	 * @param string $old_url    The url that has to be redirect.
	 * @param string $new_url    The target url.
	 * @param string $type       The type of redirect.
	 * @param bool   $unique_url When there is an unique_url given, it would validate if the new one is unique.
	 *
	 * @return bool|string
	 */
	public function validate( $old_url, $new_url, $type = '', $unique_url = false ) {
		// When the parent already has found an error, break this method.
		if ( parent::validate( $old_url, $new_url, $type, $unique_url ) ) {
			return true;
		}

		// When current request is a 410 request, there is no endpoint to validate.
		if ( $this->is_410( $type ) ) {
			return false;
		}

		// Validate if the target url is accessible.
		if ( $this->validate_accessible( $new_url ) ) {
			return true;
		}

		if ( $this->validate_end_point( $new_url, $old_url ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Strip the trailing slashes
	 *
	 * @param string $url The url to sanitize.
	 *
	 * @return string
	 */
	protected function sanitize_redirect_url( $url ) {
		return trim( $url, '/' );
	}

}
