<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validate interface for the validation classes.
 */
interface WPSEO_Redirect_Validate {

	/**
	 * Validate the redirect to check if the origin already exists.
	 *
	 * @param WPSEO_Redirect $redirect  The redirect to validate.
	 * @param array          $redirects Array with redirect to validate against.
	 *
	 * @return bool
	 */
	public function validate( WPSEO_Redirect $redirect, array $redirects = null );

	/**
	 * Getting the validation error.
	 *
	 * @return string|boolean
	 */
	public function get_error();

}
