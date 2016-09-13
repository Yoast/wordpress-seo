<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Tag_Line
 */
class WPSEO_Config_Field_Tag_Line extends WPSEO_Config_Field {
	/**
	 * WPSEO_Config_Field_Tag_Line constructor.
	 */
	public function __construct() {
		parent::__construct( 'tagLine', 'Input' );

		$this->set_property( 'label', __( 'Enter the tag line you want to use for your website. Using the default tag line is not recommended.', 'wordpress-seo' ) );
	}

	/**
	 * Set the adapter to use
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_wordpress_lookup( $this->get_identifier(), 'blogdescription' );
	}
}
