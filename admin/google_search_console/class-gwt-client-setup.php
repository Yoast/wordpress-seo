<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GWT_Client
 */
class WPSEO_GWT_Client_Setup {

	/**
	 * @var WPSEO_GWT_Client
	 */
	public $client;

	/**
	 * Setting up the client with the specified config
	 */
	public function __construct() {
		Yoast_Api_Libs::load_api_libraries( array( 'google' ) );

		$config = array();
		require  'config/gwt.php';

		$this->client = new WPSEO_GWT_Client( $config );
	}

	/**
	 * Returns the client object
	 * @return WPSEO_GWT_Client
	 */
	public function get_client( ) {
		return $this->client;
	}

}
