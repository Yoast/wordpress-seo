<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validates the accessibility of a redirect's target
 */
class WPSEO_Redirect_Accessible_Validation implements WPSEO_Redirect_Validation {

	/**
	 * @var WPSEO_Validation_Result The validation error.
	 */
	private $error;

	/**
	 * Validates if the target is accessible and based on its response code it will set a warning (if applicable).
	 *
	 * @param WPSEO_Redirect $redirect  The redirect to validate.
	 * @param WPSEO_Redirect $old_redirect The old redirect to compare.
	 * @param array|null     $redirects Unused.
	 *
	 * @return bool Whether or not the target is valid.
	 */
	public function run( WPSEO_Redirect $redirect, WPSEO_Redirect $old_redirect = null, array $redirects = null ) {
		// Do the request.
		$target      = $this->parse_target( $redirect->get_target() );
		$decoded_url = rawurldecode( $target );
		$response    = $this->remote_head( $decoded_url, array( 'sslverify' => false ) );

		if ( is_wp_error( $response ) ) {
			$this->error = new WPSEO_Validation_Warning(
				__( 'The URL you entered could not be resolved.', 'wordpress-seo-premium' ),
				'target'
			);

			return false;
		}

		$response_code = $this->retrieve_response_code( $response );

		// Check if the target is a temporary location.
		if ( $this->is_temporary( $response_code ) ) {
			$this->error = new WPSEO_Validation_Warning( sprintf(
				/* translators: %1$s expands to the returned http code  */
				__( 'The URL you are redirecting to seems to return a %1$s status. You might want to check if the target can be reached manually before saving.', 'wordpress-seo-premium' ),
				$response_code
			), 'target' );

			return false;
		}

		// Check if the response code is 301.
		if ( $response_code === 301 ) {
			$this->error = new WPSEO_Validation_Warning(
				__( 'You\'re redirecting to a target that returns a 301 HTTP code (permanently moved). Make sure the target you specify is directly reachable.', 'wordpress-seo-premium' ),
				'target'
			);

			return false;
		}

		if ( $response_code !== 200 ) {
			$this->error = new WPSEO_Validation_Warning( sprintf(
				/* translators: %1$s expands to the returned http code  */
				__( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is %1$s.', 'wordpress-seo-premium' ),
				$response_code
			), 'target' );

			return false;
		}

		return true;
	}

	/**
	 * Retrieves the response code from the response array.
	 *
	 * @param array $response The response.
	 *
	 * @return int The response code.
	 */
	protected function retrieve_response_code( $response ) {
		return wp_remote_retrieve_response_code( $response );
	}

	/**
	 * Sends a HEAD request to the passed remote URL.
	 *
	 * @param string $url The URL to send the request to.
	 * @param array  $options The options to send along with the request.
	 *
	 * @return array|WP_Error The response or WP_Error if something goes wrong.
	 */
	protected function remote_head( $url, $options = array() ) {
		return wp_remote_head( $url, $options );
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
	protected function is_temporary( $response_code ) {
		return in_array( $response_code, array( 302, 307 ), true ) || in_array( substr( $response_code, 0, 2 ), array( '40', '50' ), true );
	}

	/**
	 * Check if the target is relative, if so just parse a full URL.
	 *
	 * @param string $target The target to pars.
	 *
	 * @return string
	 */
	protected function parse_target( $target ) {
		$url_parts = wp_parse_url( $target );

		// If we have an absolute url return it.
		if ( ! empty( $url_parts['scheme'] ) ) {
			return $target;
		}

		// If we have a relative url make it absolute.
		$absolute = get_home_url( null, $target );

		// If the path does not end with an extension then add a trailing slash.
		if ( WPSEO_Redirect_Util::requires_trailing_slash( $target ) ) {
			return trailingslashit( $absolute );
		}

		return $absolute;
	}
}
