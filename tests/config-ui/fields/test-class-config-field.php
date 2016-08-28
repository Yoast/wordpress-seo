<?php
/**
 * @package WPSEO\UnitTests
 */

/**
 * Class WPSEO_Config_Field_
 */
class WPSEO_Config_Field_ extends WPSEO_Config_Field {

	/**
	 * @param $data
	 */
	public function set_data( $data ) {
		$this->data = $data;
	}
}

/**
 * Class WPSEO_Config_Field_Test
 */
class WPSEO_Config_Field_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_Config_Field::__construct()
	 * @covers WPSEO_Config_Field::get_identifier()
	 * @covers WPSEO_Config_Field::get_component()
	 */
	public function test_constructor() {

		$identifier = 'i';
		$component  = 'c';

		$field = new WPSEO_Config_Field_( $identifier, $component );

		$this->assertEquals( $identifier, $field->get_identifier() );
		$this->assertEquals( $component, $field->get_component() );
	}

	/**
	 * @covers WPSEO_Config_Field::set_property()
	 * @covers WPSEO_Config_Field::get_properties()
	 */
	public function test_properties() {
		$property       = 'p';
		$property_value = 'pv';

		$field = new WPSEO_Config_Field_( 'a', 'b' );
		$field->set_property( $property, $property_value );

		$properties = $field->get_properties();

		$this->assertEquals(
			array( $property => $property_value ),
			$properties
		);
	}

	/**
	 * @covers WPSEO_Config_Field::get_data()
	 */
	public function test_get_data() {
		$data = 'test';

		$field = new WPSEO_Config_Field_( 'a', 'b' );
		$field->set_data( $data );

		$this->assertEquals( $data, $field->get_data() );
	}
}
