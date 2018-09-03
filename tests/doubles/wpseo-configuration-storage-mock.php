<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Configuration_Storage_Mock
 */
class WPSEO_Configuration_Storage_Mock extends WPSEO_Configuration_Storage {

	public function get_fields() {
		return $this->fields;
	}

	public function is_not_null( $input ) {
		return parent::is_not_null( $input );
	}

	public function get_field_data( WPSEO_Config_Field $field ) {
		return parent::get_field_data( $field );
	}
}
