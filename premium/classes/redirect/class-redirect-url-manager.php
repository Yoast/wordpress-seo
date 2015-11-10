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
	 * @var string Is plain for this manager.
	 */
	protected $redirect_format = WPSEO_Redirect::FORMAT_PLAIN;

	/**
	 * Create a new redirect
	 *
	 * @param string $old_value The old value that will be redirected.
	 * @param string $new_value The target where the old value will redirect to.
	 * @param int    $type      Type of the redirect.
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
	 * @param string $old_redirect_key The old redirect, the value is a key in the redirects array.
	 * @param array  $new_redirect     Array with values for the update redirect.
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
	 * @param array $delete_redirects Array with the redirects to remove.
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
