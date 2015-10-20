<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Class WPSEO_Redirect_Validate
 */
abstract class WPSEO_Redirect_Validator {

	/**
	 * @var array Property with the redirects.
	 */
	protected $redirects = array();

	/**
	 * @var bool|string The validation error.
	 */
	protected $validation_error = false;

	/**
	 * Converting the redirects into a readable format
	 *
	 * @param array $redirects Array with the redirects.
	 */
	public function __construct( array $redirects = array() ) {
		foreach ( $redirects as $redirect_url => $redirect ) {
			$this->redirects[ $this->sanitize_redirect_url( $redirect_url ) ] = $this->sanitize_redirect_url( $redirect['url'] );
		}
	}

	/**
	 * Validates the old and the new url
	 *
	 * @param string $old_url    The url that has to be redirect.
	 * @param string $new_url    The target url.
	 * @param string $type       The type of redirect.
	 * @param bool   $unique_url When there is an unique_url given, it would validate if the new one is unique.
	 *
	 * @return bool|string
	 */
	public function validate( $old_url, $new_url, $type = '', $unique_url = false ) {
		// Check if the redirect already exist.
		if ( $this->validate_redirect_exists( $old_url, $unique_url ) ) {
			return $this->set_error( __( 'The old url already exists as a redirect', 'wordpress-seo-premium' ) );
		}

		// Validate if the required fields are filled.
		if ( ! $this->validate_filled( $old_url, $new_url, $type ) ) {
			return $this->set_error( __( 'Not all the required fields are filled', 'wordpress-seo-premium' ) );
		}

		return false;
	}

	/**
	 * Check if the validation error property is filled
	 *
	 * @return bool
	 */
	public function has_error() {
		return ! empty( $this->validation_error );
	}

	/**
	 * Returns the validation error
	 *
	 * @return bool|string
	 */
	public function get_error() {
		return $this->validation_error;
	}

	/**
	 * Sanitize the URL for displaying on the window
	 *
	 * @param string $url The url to sanitize.
	 *
	 * @return string
	 */
	public function sanitize_url( $url ) {
		return trim( htmlspecialchars_decode( rawurldecode( $url ) ) );
	}

	/**
	 * Check if the redirect already exists and if it should be unique.
	 *
	 * @param string $old_url    The url that has to be redirect.
	 * @param bool   $unique_url When there is an unique_url given, it would validate if the new one is unique.
	 *
	 * @return bool
	 */
	protected function validate_redirect_exists( $old_url, $unique_url ) {
		$unique_check = ( $unique_url === false || ( $unique_url !== $old_url ) );

		// Check if there is already an error.
		return $unique_check && $this->redirect_exists( $old_url );
	}

	/**
	 * Check if the $url exist as a redirect
	 *
	 * @param string $url The url to check if it's redirected.
	 *
	 * @return bool
	 */
	protected function redirect_exists( $url ) {
		return array_key_exists( $this->sanitize_redirect_url( $url ), $this->redirects );
	}

	/**
	 * Strip the trailing slashes
	 *
	 * @param string $url The redirect url to sanitize.
	 *
	 * @return string
	 */
	protected function sanitize_redirect_url( $url ) {
		return $url;
	}

	/**
	 * Validate if all the fields are filled
	 *
	 * @param string $old_url The old url that will be redirected.
	 * @param string $new_url The target where the old url will redirect to.
	 * @param string $type    Type of the redirect.
	 *
	 * @return bool
	 */
	protected function validate_filled( $old_url, $new_url, $type ) {
		return ( $old_url !== '' && $new_url !== '' && $type !== '' );
	}

	/**
	 * Setting the validation error message
	 *
	 * @param string $error_message String that will be saved as the validation error.
	 *
	 * @return bool
	 */
	protected function set_error( $error_message ) {
		$this->validation_error = $error_message;

		return true;
	}

}
