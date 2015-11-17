<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Regex_Manager
 */
class WPSEO_Redirect_Regex_Manager extends WPSEO_Redirect_Manager {

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

}
