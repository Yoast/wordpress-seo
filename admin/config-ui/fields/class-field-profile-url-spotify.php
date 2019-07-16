<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Spotify.
 */
class WPSEO_Config_Field_Profile_URL_Spotify extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_Spotify constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlSpotify', 'Input' );

		$this->set_property( 'label', __( 'Spotify URL', 'wordpress-seo' ) );
		$this->set_property( 'pattern', '^https:\/\/www\.spotify\.com\/([^/]+)\/$' );

		$this->set_requires( 'publishingEntityType', 'company' );
	}

	/**
	 * Set adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'spotify_url' );
	}
}
