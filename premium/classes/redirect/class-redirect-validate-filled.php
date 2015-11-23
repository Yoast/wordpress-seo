<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating all redirect fields being filled correctly.
 */
class WPSEO_Redirect_Validate_Filled implements WPSEO_Redirect_Validate {

	/**
	 * @var string The validation error.
	 */
	private $error;

	/**
	 * @var string
	 */
	private $warning;

	/**
	 * Validate the redirect to check if the origin already exists.
	 *
	 * @param WPSEO_Redirect $redirect  The redirect to validate.
	 * @param array|null     $redirects Unused.
	 *
	 * @return bool
	 */
	public function validate( WPSEO_Redirect $redirect, array $redirects = null ) {
		// If redirect type id 410, the target doesn't have to be filled.
		if ( $redirect->get_type() === WPSEO_Redirect::DELETED && $redirect->get_origin() !== '' ) {
			return true;
		}

		if ( ( $redirect->get_origin() !== '' && $redirect->get_target() !== '' && $redirect->get_type() !== '' ) ) {
			return true;
		}

		$this->error = __( 'Not all the required fields are filled', 'wordpress-seo-premium' );

		return false;
	}

	/**
	 * Returns the validation error
	 *
	 * @return string
	 */
	public function get_error() {
		return $this->error;
	}

	/**
	 * Returns the validation warning
	 *
	 * @return string
	 */
	public function get_warning() {
		return $this->warning;
	}


}
