<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator class for the regular expressions.
 */
class WPSEO_Redirect_URL_Validator extends WPSEO_Redirect_Validator {

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
		// When the parent already has found an error, break this method.
		if ( parent::validate( $old_url, $new_url, $type, $unique_url ) ) {
			return true;
		}

		// When current request is a 410 request, there is no endpoint to validate.
		if ( $this->is_410( $type ) ) {
			return false;
		}

		// Validate if the target url is accessible.
		if ( $this->validate_accessible( $new_url ) ) {
			return true;
		}

		if ( $this->validate_end_point( $new_url, $old_url ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Strip the trailing slashes
	 *
	 * @param string $url The url to sanitize.
	 *
	 * @return string
	 */
	protected function sanitize_redirect_url( $url ) {
		return trim( $url, '/' );
	}

	/**
	 * Check if the current URL is accessible
	 *
	 * @param string $url  URL to validate it accessibility.
	 *
	 * @return bool
	 */
	private function validate_accessible( $url ) {

		// Do the request.
		$decoded_url   = rawurldecode( $url );
		$response      = wp_remote_head( $decoded_url, array( 'sslverify' => false ) );
		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code !== '' && $response_code !== 200 ) {
			return $this->set_error(
				/* translators: %1$s expands to the returned http code  */
				sprintf(
					__( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is %1$s.', 'wordpress-seo-premium' ),
					$response_code
				)
			);
		}

		return false;
	}

	/**
	 * Validate if the redirect doesn't result in a redirect loop and check if the redirect can be done shorter.
	 *
	 * @param string $new_url The new url to search for.
	 * @param string $old_url The current url that is redirected.
	 *
	 * @return bool|string
	 */
	private function validate_end_point( $new_url, $old_url  ) {
		$endpoint = $this->search_end_point( $new_url, $old_url );

		if ( $endpoint === false ) {
			return false;
		}

		// Check for a redirect loop.
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

		return false;
	}

	/**
	 * Will check if the $new_url is redirected also and follows the trace of this redirect
	 *
	 * @param string $new_url The new url to search for.
	 * @param string $old_url The current url that is redirected.
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
	 * @param string $url The url to search for.
	 *
	 * @return bool
	 */
	private function find_url( $url ) {
		if ( ! empty( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ];
		}

		return false;
	}
}
