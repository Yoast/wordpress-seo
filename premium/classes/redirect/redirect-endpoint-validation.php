<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validates the endpoint of a redirect
 */
class WPSEO_Redirect_Endpoint_Validation implements WPSEO_Redirect_Validation {

	/**
	 * @var array
	 */
	private $redirects;

	/**
	 * @var WPSEO_Validation_Result
	 */
	private $error;

	/**
	 * This validation checks if the redirect being created, follows:
	 * - a path that results in a redirection to it's own origin due to other redirects pointing to the current origin.
	 * - a path that can be shorten by creating a direct redirect.
	 *
	 * @param WPSEO_Redirect $redirect     The redirect to validate.
	 * @param WPSEO_Redirect $old_redirect The old redirect to compare.
	 * @param array          $redirects    Array with redirect to validate against.
	 *
	 * @return bool
	 */
	public function run( WPSEO_Redirect $redirect, WPSEO_Redirect $old_redirect = null, array $redirects = null ) {
		$this->redirects = $redirects;

		$origin   = $redirect->get_origin();
		$target   = $redirect->get_target();
		$endpoint = $this->search_end_point( $target, $origin );

		// Check for a redirect loop.
		if ( is_string( $endpoint ) && in_array( $endpoint, array( $origin, $target ), true ) ) {
			// There might be a redirect loop.
			$this->error = new WPSEO_Validation_Error(
				__( 'The redirect you are trying to save will create a redirect loop. This means there probably already exists a redirect that points to the origin of the redirect you are trying to save', 'wordpress-seo-premium' ),
				array( 'origin', 'target' )
			);

			return false;
		}

		if ( is_string( $endpoint ) && $target !== $endpoint ) {
			$this->error = new WPSEO_Validation_Warning( sprintf(
				/* translators: %1$s: will be the target, %2$s: will be the found endpoint. */
				__( '%1$s will be redirected to %2$s. Maybe it\'s worth considering to create a direct redirect to %2$s.', 'wordpress-seo-premium' ),
				$target,
				$endpoint
			), 'target' );

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
	 * Will check if the $new_url is redirected also and follows the trace of this redirect
	 *
	 * @param string $new_url The new URL to search for.
	 * @param string $old_url The current URL that is redirected.
	 *
	 * @return bool|string
	 */
	private function search_end_point( $new_url, $old_url ) {
		$new_target = $this->find_url( $new_url );
		if ( $new_target !== false ) {
			// Unset the redirects, because it was found already.
			unset( $this->redirects[ $new_url ] );

			if ( $new_url !== $old_url ) {
				$traced_target = $this->search_end_point( $new_target, $old_url );
				if ( $traced_target !== false ) {
					return $traced_target;
				}
			}

			return $new_target;
		}

		return false;
	}

	/**
	 * Search for the given $url and returns it target
	 *
	 * @param string $url The URL to search for.
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
