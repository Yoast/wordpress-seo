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

		// Check if the target is a temporary location.
		if ( $this->is_temporary( $response_code ) ) {
			/* translators: %1$s expands to the returned http code  */
			$this->warning = sprintf(
				__( 'The url you are redirecting to returns a %1$s status. You might want to consider redirecting to another url.', 'wordpress-seo-premium' ),
				$response_code
			);

			return false;
		}


		if ( $response_code !== 200 ) {
			/* translators: %1$s expands to the returned http code  */
			$this->warning = sprintf(
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

	/**
	 * Check if the given response code is a temporary one.
	 *
	 * @param int $response_code The response code to check.
	 *
	 * @return bool
	 */
	private function is_temporary( $response_code ) {
		return in_array( $response_code, array( 302, 307 ) ) || in_array( substr( $response_code, 0, 2 ), array( 40, 50 ) );
	}

}
