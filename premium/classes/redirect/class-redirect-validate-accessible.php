<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the accessibility of a redirect's target
 */
class WPSEO_Redirect_Validate_Accessible implements WPSEO_Redirect_Validate {

	/**
	 * @var WPSEO_Validation_Result The validation error.
	 */
	private $error;

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
		$target        = $this->parse_target( $redirect->get_target() );
		$decoded_url   = rawurldecode( $target );
		$response      = wp_remote_head( $decoded_url, array( 'sslverify' => false ) );

		if ( is_wp_error( $response ) ) {
			$this->error = new WPSEO_Validation_Warning(
				__( 'The URL you entered could not be resolved.', 'wordpress-seo-premium' )
			);

			return false;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		// Check if the target is a temporary location.
		if ( $this->is_temporary( $response_code ) ) {
			/* translators: %1$s expands to the returned http code  */
			$this->error = new WPSEO_Validation_Warning( sprintf(
				__( 'The url you are redirecting to returns a %1$s status. You might want to consider redirecting to another url.', 'wordpress-seo-premium' ),
				$response_code
			) );

			return false;
		}

		// Check if the response code is 301.
		if ( $response_code === 301 ) {
			$this->error = new WPSEO_Validation_Error(
				__( 'You\'re redirecting to a target that returns a 301 HTTP code (permanently moved). Make sure the target you specify is directly reachable.'
				) );

			return false;
		}

		if ( $response_code !== 200 ) {
			/* translators: %1$s expands to the returned http code  */
			$this->error = new WPSEO_Validation_Warning( sprintf(
				__( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is %1$s.', 'wordpress-seo-premium' ),
				$response_code
			) );

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

	/**
	 * Check if the target is relative, if so just parse a full url.
	 *
	 * @param string $target The target to pars.
	 *
	 * @return string
	 */
	private function parse_target( $target ) {
		$url_parts = parse_url( $target );

		if ( ! empty( $url_parts['scheme'] ) ) {
			return $target;
		}

		// Parse the URL based on the home url.
		return trailingslashit( get_home_url( null, $target ) );
	}

}
