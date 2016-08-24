<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Environment extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( "environment" );

		// @todo apply i18n
		$this->set_property( 'label', sprintf( 'Please specify the environment %1$s is running in.', get_home_url() ) );

		$this->add_choice( 'production', 'Production - live site.' );
		$this->add_choice( 'staging', 'Staging - copy of live site used for testing purposes only.' );
		$this->add_choice( 'development', 'Development - locally running site used for development purposes.' );
	}
}
