<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Pinterest
 */
class WPSEO_Config_Field_Profile_URL_Pinterest extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_Pinterest constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlPinterest', 'Input' );

		$this->set_property( 'label', __( 'Pinterest URL', 'wordpress-seo' ) );
		$this->set_property( 'pattern', '^https:\/\/www\.pinterest\.com\/([^/]+)\/$' );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'pinterest_url' );
	}
}
