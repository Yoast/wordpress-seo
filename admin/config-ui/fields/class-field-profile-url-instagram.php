<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Instagram
 */
class WPSEO_Config_Field_Profile_URL_Instagram extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_Instagram constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlInstagram', 'Input' );

		$this->set_property( 'label', __( 'Instagram URL', 'wordpress-seo' ) );
		$this->set_property( 'pattern', '^https:\/\/www\.instagram\.com\/([^/]+)\/$' );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'instagram_url' );
	}
}
