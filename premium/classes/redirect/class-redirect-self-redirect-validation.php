<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating that the redirect doesn't point to itself.
 */
class WPSEO_Redirect_Self_Redirect_Validation implements WPSEO_Redirect_Validation {

	/**
	 * @var WPSEO_Validation_Result
	 */
	private $error;

	/**
	 * Validate the redirect to check if it doesn't point to itself.
	 *
	 * @param WPSEO_Redirect $redirect     The redirect to validate.
	 * @param WPSEO_Redirect $old_redirect The old redirect to compare.
	 * @param array          $redirects    Array with redirect to validate against.
	 *
	 * @return bool
	 */
	public function run( WPSEO_Redirect $redirect, WPSEO_Redirect $old_redirect = null, array $redirects = null ) {

		if ( $redirect->get_origin() === $redirect->get_target() ) {
			$this->error = new WPSEO_Validation_Error(
				__( 'You are attempting to redirect to the same URL as the origin.
					Please choose a different URL to redirect to.', 'wordpress-seo-premium' ),
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
