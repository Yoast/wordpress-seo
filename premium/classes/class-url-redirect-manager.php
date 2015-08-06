<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_URL_Redirect_Manager
 */
class WPSEO_URL_Redirect_Manager extends WPSEO_Redirect_Manager {

	/**
	 * @var array
	 */
	protected $redirects;

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
		$this->load_redirects();

		if ( isset( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ]['url'];
		}
	}

	/**
	 * Loads the redirects by getting the values and storing them into a property
	 */
	private function load_redirects() {
		$this->redirects = $this->get_redirects();
	}
}
