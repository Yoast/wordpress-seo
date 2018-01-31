<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Adds the Advanced settings toggle to the configuration wizard.
 */
class WPSEO_Config_Field_Advanced_Settings extends WPSEO_Config_Field_Choice {
	/**
	 * Set up the class.
	 */
	public function __construct() {
		parent::__construct( 'enable_setting_pages' );

		$this->set_property( 'description', $this->get_description() );

		$this->add_choice( 'true', __( 'Show the Advanced settings', 'wordpress-seo' ) );
		$this->add_choice( 'false', __( 'Hide the Advanced settings for now', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 *
	 * @return void
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_custom_lookup(
			$this->get_identifier(),
			array( $this, 'get_data' ),
			array( $this, 'set_data' )
		);
	}

	/**
	 * Gets the value that is set for this field.
	 *
	 * @return string The value for the environment_type option.
	 */
	public function get_data() {
		if ( $this->get_option_value() === true ) {
			return 'true';
		}

		return 'false';
	}

	/**
	 * Sets the new value for the option.
	 *
	 * @param string $value_to_save The value to save.
	 *
	 * @return bool Returns whether the value is successfully set.
	 */
	public function set_data( $value_to_save ) {
		// Make sure the value is a boolean.
		$value_to_save  = ( $value_to_save === 'true' );

		$this->set_option_value( $value_to_save );

		return ( $this->get_option_value() === $value_to_save );
	}

	/**
	 * Returns the value from the option.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True if advanced settings pages are enabled.
	 */
	protected function get_option_value() {
		$option = WPSEO_Options::get_option( 'wpseo' );

		return $option['enable_setting_pages'];
	}

	/**
	 * Sets the option value.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $value True or false.
	 *
	 * @return void
	 */
	protected function set_option_value( $value ) {
		$option = WPSEO_Options::get_option( 'wpseo' );
		$option['enable_setting_pages'] = $value;

		update_option( 'wpseo', $option );
	}

	/**
	 * Returns the description for the field.
	 *
	 * @return string The description for the field.
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %1$s expands to Yoast SEO  */
			__( '
				%1$s has a number of advanced settings. We have determined that the (dynamic) 
				defaults we set for those are fine for most sites. However, if you want to change 
				them, you can. To get access to these advanced settings, enable them here. 
				Good to know: you can always enable them later on if you need to.',
				'wordpress-seo'
			),
			'Yoast SEO'
		);
	}
}
