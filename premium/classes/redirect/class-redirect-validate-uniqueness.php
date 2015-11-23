<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the uniqueness of a redirect
 */
class WPSEO_Redirect_Validate_Uniqueness {

	/**
	 * @var string
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
	 * @param array          $redirects Array with redirect to validate against.
	 *
	 * @return bool
	 */
	public function validate( WPSEO_Redirect $redirect, array $redirects ) {
		if ( array_key_exists( $redirect->get_origin(), $redirects ) ) {
			$this->error = __( 'The old url already exists as a redirect', 'wordpress-seo-premium' );

			return false;
		}

		return true;
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
