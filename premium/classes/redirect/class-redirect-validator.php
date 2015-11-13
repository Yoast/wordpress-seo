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
	protected $validations = array(
		'validate_uniqueness' => array(
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'validate_filled'     => array(
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'validate_accessible' => array(
			'exclude_types'  => array( WPSEO_Redirect::DELETED ),
			'exclude_format' => array(),
		),
		'validate_end_point'  => array(
			'exclude_types'  => array( WPSEO_Redirect::DELETED ),
			'exclude_format' => array( WPSEO_Redirect::FORMAT_REGEX ),
		),
	);

	/**
	 * @var WPSEO_Redirect
	 */
	protected $redirect;

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
	 * @param WPSEO_Redirect $redirect   The redirect to validate.
	 * @param string         $old_origin The validation that might be skipped.
	 */
	public function __construct( WPSEO_Redirect $redirect, $old_origin = '' ) {
		$this->redirect = $redirect;

		// Remove uniqueness validation when old origin is the same as the current one.
		if ( $old_origin !== '' && $old_origin === $this->redirect->get_origin() ) {
			unset( $this->validations['validate_uniqueness'] );
		}

		$this->filter_validations();
		$this->set_redirects();
	}

	/**
	 * Validates the old and the new url
	 *
	 * @return bool|string
	 */
	public function validate() {
		foreach ( array_keys( $this->validations ) as $validation ) {
			if ( $validation_error = $this->$validation() ) {
				$this->set_error( $validation_error );
				return false;
			}
		}

		return true;
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
	 * Filter the validation rules.
	 */
	protected function filter_validations() {
		foreach ( $this->validations as $validation => $validation_rules ) {
			$exclude_format = in_array( $this->redirect->get_format(), $validation_rules['exclude_format'] );
			$exclude_type   = in_array( $this->redirect->get_type(), $validation_rules['exclude_types'] );

			if ( $exclude_format || $exclude_type ) {
				unset( $this->validations[ $validation ] );
			}
		}
	}

	/**
	 * Fill the redirect property
	 */
	protected function set_redirects( ) {
		$redirect_option = new WPSEO_Redirect_Option();
		$redirect_option->set_format( $this->redirect->get_format() );

		foreach ( $redirect_option->get_filtered_redirects() as $redirect ) {
			$this->redirects[ $this->sanitize_redirect_url( $redirect->get_origin() ) ] = $this->sanitize_redirect_url( $redirect->get_target() );
		}
	}

	/**
	 * Check if the redirect already exists and if it should be unique.
	 *
	 * @return bool
	 */
	protected function validate_uniqueness() {
		if ( array_key_exists( $this->sanitize_redirect_url( $this->redirect->get_origin() ), $this->redirects ) ) {
			return __( 'The old url already exists as a redirect', 'wordpress-seo-premium' );
		}

		return false;
	}

	/**
	 * Validate if all the fields are filled
	 *
	 * @return bool
	 */
	protected function validate_filled() {
		// If redirect type id 410, the target doesn't have to be filled.
		if ( $this->is_410() && $this->redirect->get_origin() !== '' ) {
			return false;
		}

		if ( ( $this->redirect->get_origin() !== '' && $this->redirect->get_target() !== '' && $this->redirect->get_type() !== '' ) ) {
			return false;
		}

		return __( 'Not all the required fields are filled', 'wordpress-seo-premium' );

	}

	/**
	 * Check if the current URL is accessible
	 *
	 * @return bool|string
	 */
	protected function validate_accessible() {

		if ( $this->is_410() ) {
			return false;
		}

		// Do the request.
		$decoded_url   = rawurldecode( $this->redirect->get_target() );
		$response      = wp_remote_head( $decoded_url, array( 'sslverify' => false ) );
		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code !== '' && $response_code !== 200 ) {
			/* translators: %1$s expands to the returned http code  */
			return sprintf(
				__( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is %1$s.', 'wordpress-seo-premium' ),
				$response_code
			);
		}

		return false;
	}

	/**
	 * Validate if the redirect doesn't result in a redirect loop and check if the redirect can be done shorter.
	 *
	 * @return bool|string
	 */
	protected function validate_end_point(  ) {

		if ( $this->is_410() ) {
			return false;
		}

		$validate_endpoint = new WPSEO_Redirect_Validate_Endpoint( $this->redirect, $this->redirects );

		if ( $validate_endpoint->is_valid()  ) {
			return false;
		}

		return $validate_endpoint->get_error();
	}



	/**
	 * Check if current redirect type is a 410
	 *
	 * @return bool
	 */
	protected function is_410() {
		return ( $this->redirect->get_type() === WPSEO_Redirect::DELETED );
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

	/**
	 * Strip the trailing slashes
	 *
	 * @param string $url The redirect url to sanitize.
	 *
	 * @return string
	 */
	private function sanitize_redirect_url( $url ) {
		if ( $this->redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN ) {
			$url = trim( $url, '/' );
		}

		return $url;
	}

}
