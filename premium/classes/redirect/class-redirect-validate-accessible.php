<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the accessibility of a redirect's target
 */
class WPSEO_Redirect_Validate_Accessible {

	/**
	 * @var string
	 */
	private $error;

	/**
	 * @var string
	 */
	private $warning;

	/**
	 * Setting the properties
	 *
	 * @param string $target The url to validate.
	 *
	 */
	public function __construct( $target ) {
		$this->validate( $target );
	}

	/**
	 * Validates if the end point is valid.
	 *
	 * @return bool
	 */
	public function is_valid() {
		return empty( $this->error );
	}

	/**
	 * Returns the validation error
	 * @return string
	 */
	public function get_error() {
		return $this->error;
	}

	/**
	 * Validate if the end point is valid
	 *
	 * @param string $target The url to validate.
	 *
	 * @return bool
	 */
	private function validate( $target ) {

		// Do the request.
		$decoded_url   = rawurldecode( $target );
		$response      = wp_remote_head( $decoded_url, array( 'sslverify' => false ) );

		if ( is_wp_error( $response ) ) {
			$this->warning = __( 'The URL you entered could not resolved.', 'wordpress-seo-premium' );

			return true;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( $response_code !== 200 ) {
			/* translators: %1$s expands to the returned http code  */
			$this->error = sprintf(
				__( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is %1$s.', 'wordpress-seo-premium' ),
				$response_code
			);
		}

		return true;
	}


}
