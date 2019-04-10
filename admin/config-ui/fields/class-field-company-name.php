<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Company_Name
 */
class WPSEO_Config_Field_Company_Name extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Company_Name constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityCompanyName', 'Input' );

		$this->set_property( 'label', __( 'The name of the organization', 'wordpress-seo' ) );
		$this->set_property( 'autoComplete', 'organization' );

		$this->set_requires( 'publishingEntityType', 'company' );
	}

	/**
	 * Sets the adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'company_name' );
	}
}
