<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Person_Name
 */
class WPSEO_Config_Field_Person_Name extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Company_Or_Person constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityPersonName', 'Input' );

		$this->set_property( 'label', __( 'The name of the person', 'wordpress-seo' ) );

		$this->set_requires( 'publishingEntityType', 'person' );
	}

	/**
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'person_name' );
	}
}
