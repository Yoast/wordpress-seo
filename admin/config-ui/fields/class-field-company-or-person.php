<?php
/**
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Company_Or_Person
 */
class WPSEO_Config_Field_Company_Or_Person extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Company_Or_Person constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityType' );

		$this->set_property( 'label', __( 'This data is shown as metadata in your site. It is intended to appear in Google\'s Knowledge Graph. You can be either a company, or a person, choose either:', 'wordpress-seo' ) );

		$this->add_choice( 'company', __( 'Company', 'wordpress-seo' ) );
		$this->add_choice( 'person', __( 'Person', 'wordpress-seo' ) );
	}

	/**
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo', 'company_or_person' );
	}
}
