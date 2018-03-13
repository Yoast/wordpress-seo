<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Configuration_Components_Mock
 */
class WPSEO_Configuration_Components_Mock extends WPSEO_Configuration_Components {

	/**
	 * Retrieve all components
	 *
	 * @return array
	 */
	public function get_components() {
		return $this->components;
	}

	/**
	 * Get the current adapter
	 *
	 * @return WPSEO_Configuration_Options_Adapter
	 */
	public function get_adapter() {
		return $this->adapter;
	}
}
