<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_YouTube
 */
class WPSEO_Config_Field_Profile_URL_Wikipedia extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_YouTube constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlWikipedia', 'Input' );

		$this->set_property( 'label', __( 'Wikipedia URL', 'wordpress-seo' ) );
		$this->set_property( 'pattern', '^https:\/\/([a-z\-]+)\.wikipedia\.org\/([^/]+)$' );
	}

	/**
	 * Sets the adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 *
	 * @return void
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'wikipedia_url' );
	}
}
