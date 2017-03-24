<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the configuration choices component.
 */
class WPSEO_Config_Component_Configuration_Choices implements WPSEO_Config_Component {

	/**
	 * Gets the component identifier.
	 *
	 * @return string
	 */
	public function get_identifier() {
		return 'ConfigurationChoices';
	}

	/**
	 * Gets the field.
	 *
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		$field = new WPSEO_Config_Field_Configuration_Choices();
		$field->add_choice(
			__( 'Configure Yoast SEO in a few steps', 'wordpress-seo' ),
			__( 'Welcome to the ...', 'wordpress-seo' ),
			array(
				'type'   => 'primary',
				'text'   => __( 'Start your configuration', 'wordpress-seo' ),
				'action' => 'next_step',
			)
		);
		$field->add_choice(
			__( 'Let us set up Yoast SEO for you', 'wordpress-seo' ),
			__( 'While we strive to make ...', 'wordpress-seo' ), array(
				'type'   => 'secondary',
				'text'   => __( 'Configuration service', 'wordpress-seo' ),
				'action' => 'followURL',
				'url'   => 'https://yoa.st/configuration_service',
			)
		);

		return $field;
	}

	/**
	 * Get the data for the field.
	 *
	 * @return mixed
	 */
	public function get_data() {
		return array();
	}

	/**
	 * Save data
	 *
	 * @param array $data Data containing changes.
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {
		return true;
	}
}
