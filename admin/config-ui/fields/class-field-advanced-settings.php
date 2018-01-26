<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Advanced_Settings.
 */
class WPSEO_Config_Field_Advanced_Settings extends WPSEO_Config_Field_Choice {
	/**
	 * WPSEO_Config_Field_Environment constructor.
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
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_custom_lookup(
			$this->get_identifier(),
			array( $this, 'get_data' ),
			array( $this, 'set_data' )
		);
	}

	/**
	 * Gets the option that is set for this field.
	 *
	 * @return string The value for the environment_type wpseo option.
	 */
	public function get_data() {
		if ( $this->get_option_value() === true ) {
			return 'true';
		}

		return 'false';
	}

	/**
	 * Set new data.
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
	 * Returns the value from the options.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True if settings pages are enabled.
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
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			/* translators: %1$s expands to Yoast SEO  */
			esc_html__( '
				%1$s also has a number of advanced settings. We have determined that the (dynamic) 
				defaults we set for those are fine for most sites. However, if you want to change 
				them, you can. To get access to these advanced settings, enable them here.',
				'wordpress-seo'
			),
			'Yoast SEO'
		);
	}
}
