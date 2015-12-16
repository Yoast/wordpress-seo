<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the accessibility of a redirect's target
 */
class WPSEO_Redirect_Validate_Accessible implements WPSEO_Redirect_Validate {

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

		// Do the request.
		$decoded_url   = rawurldecode( $redirect->get_target() );
		$response      = wp_remote_head( $decoded_url, array( 'sslverify' => false ) );

		if ( is_wp_error( $response ) ) {
			$this->warning = __( 'The URL you entered could not resolved.', 'wordpress-seo-premium' );

			return true;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		// Check if the response code is 301.
		if ( $response_code === 301 ) {
			$this->error = __( 'You\'re redirecting to a target that returns a 301 HTTP code (permanently moved). Make sure the target you specify is directly reachable.' );

			return false;
		}

		if ( $response_code !== 200 ) {
			/* translators: %1$s expands to the returned http code  */
			$this->error = sprintf(
				__( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is %1$s.', 'wordpress-seo-premium' ),
				$response_code
			);

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
