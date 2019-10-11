<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Connect_Google_Search_Console.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_Config_Field_Connect_Google_Search_Console extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Connect_Google_Search_Console constructor.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		parent::__construct( 'connectGoogleSearchConsole', 'ConnectGoogleSearchConsole' );
	}

	/**
	 * Get the data.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_data() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}
}
