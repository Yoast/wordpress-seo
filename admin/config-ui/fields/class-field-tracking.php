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
		parent::__construct( 'tracking' );

		$this->set_property( 'label', __( 'Can we collect anonymous information about your website and its usage?', 'wordpress-seo' ) );

		$this->add_choice( 'no', __( 'No, I don\'t want to allow you to track my site data.', 'wordpress-seo' ) );
		$this->add_choice( 'yes', __( 'Yes, you can track my site\'s data!', 'wordpress-seo' ) );
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
			return 'yes';
		}
		return 'no';
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
