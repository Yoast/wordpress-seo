<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Configuration_Options_Adapter_Mock
 */
class WPSEO_Configuration_Options_Adapter_Mock extends WPSEO_Configuration_Options_Adapter {

	public function get_lookups() {
		return $this->lookup;
	}

	public function add_lookup( $class_name, $type, $option ) {
		return parent::add_lookup( $class_name, $type, $option );
	}

	public function get_option_type( $class_name ) {
		return parent::get_option_type( $class_name );
	}

	public function get_option( $class_name ) {
		return parent::get_option( $class_name );
	}
}
