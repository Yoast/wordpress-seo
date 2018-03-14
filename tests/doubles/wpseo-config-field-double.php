<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Config_Field_Double
 */
class WPSEO_Config_Field_Double extends WPSEO_Config_Field {

	/**
	 * @param array|mixed $data Value of this field.
	 */
	public function set_data( $data ) {
		$this->data = $data;
	}
}
