<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Config Component interface
 */
interface WPSEO_Config_Component {
	/**
	 * @return string
	 */
	public function get_identifier();

	/**
	 * @return mixed
	 */
	public function get_data();

	/**
	 * Save changes
	 *
	 * @param array $data Data provided by the API.
	 *
	 * @return mixed
	 */
	public function set_data( $data );

	/**
	 * @return WPSEO_Config_Field
	 */
	public function get_field();
}
