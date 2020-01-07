<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Connect_Google_Search_Console.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_Config_Field_Connect_Google_Search_Console extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Connect_Google_Search_Console constructor.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		parent::__construct( 'connectGoogleSearchConsole', 'ConnectGoogleSearchConsole' );
	}

	/**
	 * Get the data.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_data() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return [];
	}
}
