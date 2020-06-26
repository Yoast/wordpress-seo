<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Tracking.
 */
class WPSEO_Config_Field_Tracking extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Tracking constructor.
	 */
	public function __construct() {
		if ( apply_filters( 'wpseo_enable_tracking', false ) !== false ) {
			return;
		}
		parent::__construct( 'tracking' );

		$this->set_property( 'description', __( 'To better understand how our users use our plugins, you can allow us to collect some data about which plugins other plugins and themes you have installed and which features you use. We won\'t collect any personal data about you or your visitors and we\'ll never resell your data.', 'wordpress-seo' ) );

		$this->set_property( 'label', __( 'Please share some data about your site with us!', 'wordpress-seo' ) );

		$this->add_choice( '0', __( 'No, I don\'t want to help.', 'wordpress-seo' ) );
		$this->add_choice( '1', __( 'Yes, I\'ll gladly help!', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_custom_lookup(
			$this->get_identifier(),
			[ $this, 'get_data' ],
			[ $this, 'set_data' ]
		);
	}

	/**
	 * Gets the option that is set for this field.
	 *
	 * @return string The value for the environment_type wpseo option.
	 */
	public function get_data() {
		$tracking = WPSEO_Options::get( 'tracking' );
		if ( $tracking ) {
			return '1';
		}
		return '0';
	}

	/**
	 * Set new data.
	 *
	 * @param string $tracking The site's environment type.
	 *
	 * @return bool Returns whether the value is successfully set.
	 */
	public function set_data( $tracking ) {
		$return = true;
		if ( $this->get_data() !== $tracking ) {
			$return = WPSEO_Options::set( 'tracking', $tracking );
		}

		return $return;
	}
}
