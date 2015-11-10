<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Regex_Manager
 */
class WPSEO_Redirect_Regex_Manager extends WPSEO_Redirect_Manager {

	/**
	 * @var string
	 */
	protected $option_redirects = 'wpseo-premium-redirects-regex';

	/**
	 * @var string Is Regex for this manager.
	 */
	protected $redirect_format = WPSEO_Redirect::FORMAT_REGEX;

	/**
	 * Returns the validator object
	 *
	 * @return WPSEO_Redirect_URL_Validator
	 */
	public function get_validator() {
		return new WPSEO_Redirect_Regex_Validator( $this->get_redirects() );
	}

	/**
	 * Getting the redirect managers
	 *
	 * @return WPSEO_Redirect_Manager[]
	 */
	protected function get_redirect_managers() {
		return array(
			'url'   => new WPSEO_Redirect_URL_Manager(),
			'regex' => $this,
		);
	}

}
