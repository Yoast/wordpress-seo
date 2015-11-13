<?php

/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Validator for validating the endpoint of a redirect
 */
class WPSEO_Redirect_Validate_Endpoint {

	/**
	 * @var WPSEO_Redirect
	 */
	private $redirect;

	/**
	 * @var array
	 */
	private $redirects;

	/**
	 * @var string
	 */
	private $error;

	/**
	 * Setting the properties
	 * @param WPSEO_Redirect $redirect  The redirect to validate.
	 * @param array          $redirects Array with the redirects.
	 */
	public function __construct( WPSEO_Redirect $redirect, array $redirects ) {
		$this->redirect  = $redirect;
		$this->redirects = $redirects;

		$this->validate();
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
	 * @return bool
	 */
	private function validate() {
		$endpoint = $this->search_end_point( $this->redirect->get_target(), $this->redirect->get_origin() );

		if ( $endpoint === false ) {
			return true;
		}

		// Check for a redirect loop.
		if ( in_array( $endpoint, array( $this->redirect->get_origin(), $this->redirect->get_target() ) ) ) {
			// There might be a redirect loop.
			$this->error = __( 'There might be a redirect loop.', 'wordpress-seo-premium' );

			return false;
		}

		if ( $this->redirect->get_target() !== $endpoint ) {
			// The current redirect will be redirected to ... Maybe it's worth considering to create a direct redirect to ...
			$this->error = sprintf(
				__( '%1$s will be redirected to %2$s. Maybe it\'s worth considering to create a direct redirect to %2$s.', 'wordpress-seo-premium' ),
				$this->redirect->get_target(),
				$endpoint
			);

			return false;
		}

		return true;
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
