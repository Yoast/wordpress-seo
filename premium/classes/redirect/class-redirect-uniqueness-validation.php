<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the uniqueness of a redirect
 */
class WPSEO_Redirect_Uniqueness_Validation implements WPSEO_Redirect_Validation {

	/**
	 * @var WPSEO_Validation_Result
	 */
	private $error;

	/**
	 * Validate the redirect to check if the origin already exists.
	 *
	 * @param WPSEO_Redirect $redirect     The redirect to validate.
	 * @param WPSEO_Redirect $old_redirect The old redirect to compare.
	 * @param array          $redirects    Array with redirect to validate against.
	 *
	 * @return bool
	 */
	public function run( WPSEO_Redirect $redirect, WPSEO_Redirect $old_redirect = null, array $redirects = null ) {

		// Remove uniqueness validation when old origin is the same as the current one.
		if ( is_a( $old_redirect, 'WPSEO_Redirect' ) && $redirect->get_origin() === $old_redirect->get_origin() ) {
			return true;
		}

		if ( array_key_exists( $redirect->get_origin(), $redirects ) ) {
			$this->error = new WPSEO_Validation_Error(
				__( 'The old URL already exists as a redirect.', 'wordpress-seo-premium' ),
				'origin'
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
