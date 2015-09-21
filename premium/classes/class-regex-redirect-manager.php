<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_REGEX_Redirect_Manager
 */
class WPSEO_REGEX_Redirect_Manager extends WPSEO_Redirect_Manager {

	/**
	 * @var string
	 */
	protected $option_redirects = 'wpseo-premium-redirects-regex';

	/**
	 * Getting the redirect managers
	 *
	 * @return WPSEO_Redirect_Manager[]
	 */
	protected function get_redirect_managers() {
		return array(
			'url'   => new WPSEO_URL_Redirect_Manager(),
			'regex' => $this,
		);
	}

}
