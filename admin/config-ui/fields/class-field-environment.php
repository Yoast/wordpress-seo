<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Environment
 */
class WPSEO_Config_Field_Environment extends WPSEO_Config_Field_Choice {
	/**
	 * WPSEO_Config_Field_Environment constructor.
	 */
	public function __construct() {
		parent::__construct( 'environment_type' );

		/* Translators: %1$s resolves to the home_url of the blog. */
		$this->set_property( 'label', sprintf( __( 'Please specify the environment in which this site - %1$s - is running.', 'wordpress-seo' ), get_home_url() ) );

		$this->add_choice( 'production', __( 'Production (this is a live site with real traffic)', 'wordpress-seo' ) );
		$this->add_choice( 'staging', __( 'Staging (this is a copy of a live site used for testing purposes only)', 'wordpress-seo' ) );
		$this->add_choice( 'development', __( 'Development (this site is running locally for development purposes)', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo', 'environment_type' );
	}
}
