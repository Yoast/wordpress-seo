<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Company_Logo
 */
class WPSEO_Config_Field_Company_Logo extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Company_Logo constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityCompanyLogo', 'MediaUpload' );

		$this->set_property( 'label', __( 'Provide an image of the organization logo', 'wordpress-seo' ) );

		$this->set_requires( 'publishingEntityType', 'company' );
	}

	/**
	 * Sets the adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'company_logo' );
	}
}
