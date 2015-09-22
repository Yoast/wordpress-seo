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
	 * @return mixed
	 */
	public function search_url( $url ) {
		$this->redirects = $this->get_redirects();

		if ( isset( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ]['url'];
		}

		return false;
	}

	/**
	 * Save the redirect
	 *
	 * @param array $old_redirect_arr
	 * @param array $new_redirect_arr
	 */
	public function save_redirect( array $old_redirect_arr, array $new_redirect_arr ) {
		// Format the URL if it's an URL.
		$new_redirect_arr['key'] = WPSEO_Utils::format_url( $new_redirect_arr['key'] );

		parent::save_redirect( $old_redirect_arr, $new_redirect_arr );
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
}
