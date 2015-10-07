<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_URL_Redirect_Manager
 */
class WPSEO_URL_Redirect_Manager extends WPSEO_Redirect_Manager {

	/**
	 * @var string
	 */
	protected $option_redirects = 'wpseo-premium-redirects';

	/**
	 * Searches for the URL and get it's endpoint
	 *
	 * @param string $url
	 *
	 * @return string|bool
	 */
	public function search_url( $url ) {
		if ( $redirect = $this->redirect_model->search( $url ) ) {
			return $redirect['url'];
		}

		return false;
	}

	/**
	 * Create a new redirect
	 *
	 * @param string $old_value
	 * @param string $new_value
	 * @param int    $type
	 *
	 * @return bool|array
	 */
	public function create_redirect( $old_value, $new_value, $type ) {
		$old_value = WPSEO_Utils::format_url( $old_value );

		return parent::create_redirect( $old_value, $new_value, $type );
	}

	/**
	 * Save the redirect
	 *
	 * @param string $old_redirect_key
	 * @param array  $new_redirect
	 *
	 * @return array|bool
	 */
	public function update_redirect( $old_redirect_key, array $new_redirect ) {
		// Format the URL if it's an URL.
		$new_redirect['key'] = WPSEO_Utils::format_url( $new_redirect['key'] );

		return parent::update_redirect( $old_redirect_key, $new_redirect );
	}

	/**
	 * Getting the redirect managers
	 *
	 * @return WPSEO_Redirect_Manager[]
	 */
	protected function get_redirect_managers() {
		return array(
			'url'   => $this,
			'regex' => new WPSEO_REGEX_Redirect_Manager(),
		);
	}

	/*
	protected function validate( $old_url, $new_url ) {
		// If the $new_url already exists, we've to check for an infinite redirect loop.
		$validation = new WPSEO_Redirect_Validate( $this->get_redirects() );

		if ( $validation->trace_loop() ) {

		}


	}
	*/

}
