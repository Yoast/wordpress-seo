<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_LinkedIn
 */
class WPSEO_Config_Field_Profile_URL_LinkedIn extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_LinkedIn constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlLinkedIn', 'Input' );

		$this->set_property( 'label', __( 'LinkedIn URL', 'wordpress-seo' ) );
		$this->set_property( 'pattern', '^https:\/\/www\.linkedin\.com\/in\/([^/]+)$' );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo_social', 'linkedin_url' );
	}
}
