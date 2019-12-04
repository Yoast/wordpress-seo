<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Config Component interface.
 */
interface WPSEO_Config_Component {

	/**
	 * Get onboarding wizard component identifier.
	 *
	 * @return string
	 */
	public function get_identifier();

	/**
	 * Get onboarding wizard component data.
	 *
	 * @return mixed
	 */
	public function get_data();

	/**
	 * Save changes.
	 *
	 * @param array $data Data provided by the API.
	 *
	 * @return mixed
	 */
	public function set_data( $data );

	/**
	 * Get onboarding wizard component field.
	 *
	 * @return WPSEO_Config_Field
	 */
	public function get_field();
}
