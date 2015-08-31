<?php

class WPSEO_Redirect_Validate {

	/**
	 * @var array
	 */
	private $redirects = array();

	/**
	 * Converting the redirects into a readable format
	 *
	 * @param array $redirects
	 */
	public function __construct( array $redirects ) {
		foreach ( $redirects as $redirect_url => $redirect ) {
			$this->redirects[ $this->sanitize_slashes( $redirect_url ) ] = $this->sanitize_slashes( $redirect['url'] );
		}
	}

	/**
	 * Validates the old and the new url
	 *
	 * @param string $old_url
	 * @param string $new_url
	 *
	 * @return bool|string
	 */
	public function validate( $old_url, $new_url ) {
		if ( $endpoint = $this->search_end_point( $new_url, $old_url ) ) {
			if ( in_array( $endpoint, array( $old_url, $new_url ) ) ) {
				// There might be a redirect loop.
				return __( 'There might be a redirect loop.', 'wordpress-seo-premium' );
			}

			if ( $new_url !== $endpoint ) {
				// The current redirect will be redirected to ... Maybe it's worth considering to create a direct redirect to ...
				return sprintf(
					__( '%1$s will be redirected to %2$s. Maybe it\'s worth considering to create a direct redirect to %2$s.', 'wordpress-seo-premium' ),
					$new_url,
					$endpoint
				);
			}
		}

		return false;
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
		return trim( $url, '/' );
	}

}
