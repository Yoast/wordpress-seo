<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Config_Field_Double.
 */
class WPSEO_Config_Field_Double extends WPSEO_Config_Field {

	/**
	 * Sets the data for testing.
	 *
	 * @param mixed $data Value of this field.
	 */
	public function set_data( $data ) {
		$this->data = $data;
	}
}
