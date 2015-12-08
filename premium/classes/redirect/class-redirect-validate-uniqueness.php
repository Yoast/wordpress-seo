<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the uniqueness of a redirect
 */
class WPSEO_Redirect_Validate_Uniqueness {

	/**
	 * @var WPSEO_Validation_Result
	 */
	private $error;

	/**
	 * Validate the redirect to check if the origin already exists.
	 *
	 * @param WPSEO_Redirect $redirect  The redirect to validate.
	 * @param array          $redirects Array with redirect to validate against.
	 *
	 * @return bool
	 */
	public function validate( WPSEO_Redirect $redirect, array $redirects = null ) {
		if ( array_key_exists( $redirect->get_origin(), $redirects ) ) {
			$this->error = new WPSEO_Validation_Error(
				__( 'The old url already exists as a redirect', 'wordpress-seo-premium' )
			);

			return false;
		}

		return true;
	}

	/**
	 * Returns the validation error
	 *
	 * @return WPSEO_Validation_Result
	 */
	public function get_error() {
		return $this->error;
	}

}
