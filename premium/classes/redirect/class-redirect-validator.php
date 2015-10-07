<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Class WPSEO_Redirect_Validate
 */
class WPSEO_Redirect_Validator {

	/**
	 * @var array
	 */
	private $redirects = array();

	/**
	 * @var bool|string
	 */
	private $validation_error = false;

	/**
	 * Should the input url be sanitized
	 *
	 * @var bool
	 */
	private $sanitize_slashes = false;

	/**
	 * Converting the redirects into a readable format
	 *
	 * @param bool  $sanitize_slashes
	 * @param array $redirects
	 */
	public function __construct( $sanitize_slashes = false, array $redirects = array() ) {
		$this->sanitize_slashes = $sanitize_slashes;

		foreach ( $redirects as $redirect_url => $redirect ) {
			$this->redirects[ $this->sanitize_slashes( $redirect_url ) ] = $this->sanitize_slashes( $redirect['url'] );
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

		$unique_check = ( $unique_url === false || ( $unique_url !== $old_url ) );

		// Check if there is already an error.
		if ( $unique_check && $this->redirect_exists( $old_url ) ) {
			return $this->set_error( __( 'The old url already exists as a redirect', 'wordpress-seo-premium' ) );
		}

		if ( ! $this->validate_filled( $old_url, $new_url, $type ) ) {
			return $this->set_error( __( 'Not all the required fields are filled', 'wordpress-seo-premium' ) );
		}

		if ( $endpoint = $this->search_end_point( $new_url, $old_url ) ) {
			if ( in_array( $endpoint, array( $old_url, $new_url ) ) ) {
				// There might be a redirect loop.
				return $this->set_error( __( 'There might be a redirect loop.', 'wordpress-seo-premium' ) );
			}

			if ( $new_url !== $endpoint ) {
				// The current redirect will be redirected to ... Maybe it's worth considering to create a direct redirect to ...
				return $this->set_error(
					sprintf(
						__( '%1$s will be redirected to %2$s. Maybe it\'s worth considering to create a direct redirect to %2$s.', 'wordpress-seo-premium' ),
						$new_url,
						$endpoint
					)
				);
			}
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
	 * @param string $url
	 *
	 * @return string
	 */
	public function sanitize_url( $url ) {
		return trim( htmlspecialchars_decode( urldecode( $url ) ) );
	}

	/**
	 * Check if the $url exist as a redirect
	 *
	 * @param string $url
	 *
	 * @return bool
	 */
	public function redirect_exists( $url ) {
		return array_key_exists( $this->sanitize_slashes( $url ), $this->redirects );
	}

	/**
	 * Will check if the $new_url is redirected also and follows the trace of this redirect
	 *
	 * @param string $new_url
	 * @param string $old_url
	 *
	 * @return bool|string
	 */
	private function search_end_point( $new_url, $old_url ) {
		if ( $new_target = $this->find_url( $new_url ) ) {
			// Unset the redirects, because it was found already.
			unset( $this->redirects[ $new_url ] );

			if ( $new_url !== $old_url && $traced_target = $this->search_end_point( $new_target, $old_url ) ) {
				return $traced_target;
			}

			return $new_target;
		}

		return false;
	}

	/**
	 * Search for the given $url and returns it target
	 *
	 * @param string $url
	 *
	 * @return bool
	 */
	public function find_url( $url ) {
		if ( ! empty( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ];
		}

		return false;
	}

	/**
	 * Strip the trailing slashes
	 *
	 * @param string $url
	 *
	 * @return string
	 */
	private function sanitize_slashes( $url ) {
		if ( $this->sanitize_slashes ) {
			return trim( $url, '/' );
		}

		return $url;
	}

	/**
	 * Validate if all the fields are filled
	 *
	 * @param string $old_url
	 * @param string $new_url
	 * @param string $type
	 *
	 * @return bool
	 */
	private function validate_filled( $old_url, $new_url, $type ) {
		if ( $old_url !== '' && $new_url !== '' && $type !== '' ) {
			return true;
		}

		return false;
	}

	/**
	 * Setting the validation error message
	 *
	 * @param string $error_message
	 *
	 * @return bool
	 */
	private function set_error( $error_message ) {
		$this->validation_error = $error_message;

		return true;
	}

}
