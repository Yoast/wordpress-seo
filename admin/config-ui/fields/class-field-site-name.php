<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Site_Name
 */
class WPSEO_Config_Field_Site_Name extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Site_Name constructor.
	 */
	public function __construct() {
		parent::__construct( 'siteName', 'Input' );

		$this->set_property( 'label', __( 'Website name', 'wordpress-seo' ) );
		$this->set_property( 'explanation', __( 'Google shows your website\'s name in the search results, if you want to change it, you can do that here.', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
//		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo', 'website_name' );
		$adapter->add_custom_lookup( $this, 'get_data', 'set_data' );
	}

	/**
	 * Get the data from the stored options.
	 *
	 * @return null|string
	 */
	public function get_data() {
		return array(
			'sitename' => get_bloginfo( 'name' ),
		);
	}
}
