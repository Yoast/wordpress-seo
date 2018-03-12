<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validates that all redirect fields have been correctly filled.
 */
class WPSEO_Redirect_Presence_Validation implements WPSEO_Redirect_Validation {

	/**
	 * The validation error.
	 *
	 * @var WPSEO_Validation_Result
	 */
	private $error;

	/**
	 * Validates if the redirect has all the required fields.
	 * - For a 410 and 451 type redirect the target isn't necessary.
	 * - For all other redirect types the target is required.
	 *
	 * @param WPSEO_Redirect $redirect     The redirect to validate.
	 * @param WPSEO_Redirect $old_redirect The old redirect to compare.
	 * @param array|null     $redirects    Unused.
	 *
	 * @return bool
	 */
	public function run( WPSEO_Redirect $redirect, WPSEO_Redirect $old_redirect = null, array $redirects = null ) {
		// If redirect type is 410 or 451, the target doesn't have to be filled.
		if ( $this->allow_empty_target( $redirect->get_type() ) && $redirect->get_origin() !== '' ) {
			return true;
		}

		if ( ( $redirect->get_origin() !== '' && $redirect->get_target() !== '' && $redirect->get_type() !== '' ) ) {
			return true;
		}

		$this->error = new WPSEO_Validation_Error(
			__( 'Not all the required fields are filled.', 'wordpress-seo-premium' )
		);

		return false;
	}

	/**
	 * Returns the validation error.
	 *
	 * @return WPSEO_Validation_Result
	 */
	public function get_error() {
		return $this->error;
	}

	/**
	 * Allows an empty target when the given redirect type matches one of the values in the array.
	 *
	 * @param string $redirect_type The type to match.
	 *
	 * @return bool
	 */
	private function allow_empty_target( $redirect_type ) {
		$allowed_redirect_types = array( WPSEO_Redirect::DELETED, WPSEO_Redirect::UNAVAILABLE );

		return in_array( (int) $redirect_type, $allowed_redirect_types, true );

	}
}
