<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI\Fields
 */

/**
 * Class WPSEO_Config_Field_Test
 */
class WPSEO_Config_Field_Test extends PHPUnit_Framework_TestCase {

	/**
	 * @covers WPSEO_Config_Field::__construct()
	 * @covers WPSEO_Config_Field::get_identifier()
	 * @covers WPSEO_Config_Field::get_component()
	 */
	public function test_constructor() {

		$identifier = 'i';
		$component  = 'c';

		$field = new WPSEO_Config_Field_Double( $identifier, $component );

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

		$field = new WPSEO_Config_Field_Double( 'a', 'b' );
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

		$field = new WPSEO_Config_Field_Double( 'a', 'b' );
		$field->set_data( $data );

		$this->assertEquals( $data, $field->get_data() );
	}

	/**
	 * @covers WPSEO_Config_Field::set_requires()
	 * @covers WPSEO_Config_Field::get_requires()
	 */
	public function test_set_requires() {
		$field_b = 'field_b';
		$value   = 'value';

		$expected = array(
			'field' => $field_b,
			'value' => $value,
		);

		$field = new WPSEO_Config_Field( 'field_a', 'component' );
		$field->set_requires( $field_b, $value );

		$result = $field->get_requires();

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Field::to_array()
	 */
	public function test_to_array() {
		$field = new WPSEO_Config_Field( 'a', 'b' );

		$result = $field->to_array();

		$this->assertInternalType( 'array', $result );
		$this->assertArrayHasKey( 'componentName', $result );
	}

	/**
	 * @covers WPSEO_Config_Field::to_array()
	 */
	public function test_to_array_requires() {
		$field = new WPSEO_Config_Field( 'a', 'b' );
		$field->set_requires( 'b', 'c' );

		$result = $field->to_array();

		$this->assertArrayHasKey( 'requires', $result );
		$this->assertEquals( 'b', $result['requires']['field'] );
		$this->assertEquals( 'c', $result['requires']['value'] );
	}

	/**
	 * @covers WPSEO_Config_Field::to_array()
	 */
	public function test_to_array_properties() {
		$property       = 'p';
		$property_value = 'pv';

		$field = new WPSEO_Config_Field( 'a', 'b' );
		$field->set_property( $property, $property_value );

		$result = $field->to_array();

		$this->assertArrayHasKey( 'properties', $result );
		$this->assertArrayHasKey( $property, $result['properties'] );
		$this->assertEquals( $property_value, $result['properties'][ $property ] );
	}
}
