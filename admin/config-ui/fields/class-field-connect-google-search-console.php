<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Connect_Google_Search_Console
 */
class WPSEO_Config_Field_Connect_Google_Search_Console extends WPSEO_Config_Field {
	/**
	 * WPSEO_Config_Field_Connect_Google_Search_Console constructor.
	 */
	public function __construct() {
		parent::__construct( 'connectGoogleSearchConsole', 'ConnectGoogleSearchConsole' );
	}

	/**
	 * Get the data
	 *
	 * @return array
	 */
	public function get_data() {
		return array(
			'profile'     => '',
			'profileList' => '',
		);
	}
}
