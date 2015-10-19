<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_URL_Manager
 */
class WPSEO_Redirect_URL_Manager extends WPSEO_Redirect_Manager {

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
		if ( $redirect = $this->redirect->search( $url ) ) {
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
		$old_redirect_key    = WPSEO_Utils::format_url( $old_redirect_key );
		$new_redirect['key'] = WPSEO_Utils::format_url( $new_redirect['key'] );

		return parent::update_redirect( $old_redirect_key, $new_redirect );
	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects
	 *
	 * @return bool
	 */
	public function delete_redirects( array $delete_redirects ) {
		if ( is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
			foreach ( $delete_redirects as $delete_key => $delete_redirect ) {
				$delete_redirects[ $delete_key ] = WPSEO_Utils::format_url( $delete_redirect );
			}
		}

		return parent::delete_redirects( $delete_redirects );
	}

	/**
	 * Returns the validator object
	 *
	 * @return WPSEO_Redirect_URL_Validator
	 */
	public function get_validator() {
		return new WPSEO_Redirect_URL_Validator( $this->get_redirects() );
	}

	/**
	 * Getting the redirect managers
	 *
	 * @return WPSEO_Redirect_Manager[]
	 */
	protected function get_redirect_managers() {
		return array(
			'url'   => $this,
			'regex' => new WPSEO_Redirect_Regex_Manager(),
		);
	}


}
