<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Class WPSEO_Configuration_Storage_Test.
 */
class WPSEO_Configuration_Storage_Test extends TestCase {

	use Yoast_SEO_ReflectionToString_Deprecation_Handler;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Configuration_Storage_Mock
	 */
	protected $storage;

	/**
	 * Set up.
	 */
	public function set_up() {
		parent::set_up();

		$this->storage = new WPSEO_Configuration_Storage_Mock();
	}

	/**
	 * Tests adding a field.
	 *
	 * @covers WPSEO_Configuration_Storage::add_field
	 */
	public function test_add_field() {

		$this->expect_reflection_deprecation_warning_php74();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( [ 'field', 'component' ] )
			->getMock();

		$this->assertNull( $this->storage->add_field( $field ) );
		$this->assertEquals( [ $field ], $this->storage->get_fields() );
	}

	/**
	 * Tests setting the adapter.
	 *
	 * @covers WPSEO_Configuration_Storage::set_adapter
	 * @covers WPSEO_Configuration_Storage::get_adapter
	 */
	public function test_set_adapter() {
		$adapter = new WPSEO_Configuration_Options_Adapter();

		$this->assertNull( $this->storage->set_adapter( $adapter ) );
		$this->assertEquals( $adapter, $this->storage->get_adapter() );
	}

	/**
	 * Tests the method that checks if a value is not null.
	 *
	 * @covers WPSEO_Configuration_Storage::is_not_null
	 */
	public function test_is_not_null() {
		$this->assertTrue( $this->storage->is_not_null( '1' ) );
		$this->assertFalse( $this->storage->is_not_null( null ) );
	}

	/**
	 * Test get field data with string.
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data
	 */
	public function test_get_field_data_null() {

		$this->expect_reflection_deprecation_warning_php74();

		$data = null;

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'get' ] )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( [ 'field', 'type' ] )
			->getMock();

		$adapter
			->expects( $this->once() )
			->method( 'get' )
			->with( $field )
			->will( $this->returnValue( $data ) );

		$this->storage->set_adapter( $adapter );

		$this->assertEquals( $data, $this->storage->get_field_data( $field ) );
	}

	/**
	 * Test get field data default Field value.
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data
	 */
	public function test_get_field_data_field_default() {

		$this->expect_reflection_deprecation_warning_php74();

		$data    = null;
		$default = 'default';

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'get' ] )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( [ 'field', 'type' ] )
			->getMock();

		$field
			->expects( $this->once() )
			->method( 'get_data' )
			->will( $this->returnValue( $default ) );

		$adapter
			->expects( $this->once() )
			->method( 'get' )
			->with( $field )
			->will( $this->returnValue( $data ) );

		$this->storage->set_adapter( $adapter );

		$this->assertEquals( $default, $this->storage->get_field_data( $field ) );
	}

	/**
	 * Test get field data with string.
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data
	 */
	public function test_get_field_data_string() {

		$this->expect_reflection_deprecation_warning_php74();

		$data = 'data';

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'get' ] )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( [ 'field', 'type' ] )
			->getMock();

		$adapter
			->expects( $this->once() )
			->method( 'get' )
			->with( $field )
			->will( $this->returnValue( $data ) );

		$this->storage->set_adapter( $adapter );

		$this->assertEquals( $data, $this->storage->get_field_data( $field ) );
	}

	/**
	 * Test get field data with string.
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data
	 */
	public function test_get_field_data_array() {

		$this->expect_reflection_deprecation_warning_php74();

		$data    = [ 'a' => '1' ];
		$default = [
			'a' => '2',
			'b' => '2',
		];

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'get' ] )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( [ 'field', 'type' ] )
			->getMock();

		$adapter
			->expects( $this->once() )
			->method( 'get' )
			->with( $field )
			->will( $this->returnValue( $data ) );

		$field
			->expects( $this->once() )
			->method( 'get_data' )
			->will( $this->returnValue( $default ) );

		$this->storage->set_adapter( $adapter );

		$this->assertEquals(
			[
				'a' => '1',
				'b' => '2',
			],
			$this->storage->get_field_data( $field )
		);
	}

	/**
	 * Tests the retrieval of data from the storage.
	 *
	 * @covers WPSEO_Configuration_Storage::retrieve
	 */
	public function test_retrieve() {

		if ( version_compare( PHP_VERSION_ID, 70399, '>' ) ) {
			$this->markTestSkipped( 'Skipping on PHP 7.4 due to issues with the MockBuilder dependency' );
		}

		$field          = 'f';
		$component      = 'c';
		$property       = 'p';
		$property_value = 'pv';
		$data           = 'd';

		$expected = [
			$field => [
				'componentName' => $component,
				'properties'    => [
					$property => $property_value,
				],
				'data'          => $data,
			],
		];

		$config_field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setMethods( [ 'get_identifier', 'get_properties' ] )
			->setConstructorArgs( [ $field, $component ] )
			->getMock();

		$config_field
			->expects( $this->once() )
			->method( 'get_identifier' )
			->will( $this->returnValue( $field ) );

		$config_field
			->expects( $this->once() )
			->method( 'get_properties' )
			->will( $this->returnValue( [ $property => $property_value ] ) );

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'get' ] )
			->getMock();

		$adapter
			->expects( $this->once() )
			->method( 'get' )
			->will( $this->returnValue( $data ) );

		$this->storage->set_adapter( $adapter );
		$this->storage->add_field( $config_field );

		$result = $this->storage->retrieve();

		$this->assertEquals(
			$expected,
			$result
		);
	}

	/**
	 * Tests the storage of data.
	 *
	 * @covers WPSEO_Configuration_Storage::store
	 */
	public function test_store() {

		if ( version_compare( PHP_VERSION_ID, 70399, '>' ) ) {
			$this->markTestSkipped( 'Skipping on PHP 7.4 due to issues with the MockBuilder dependency' );
		}

		$field     = 'f';
		$component = 'c';
		$data      = [ $field => [ 'data' => 'some_data' ] ];
		$return    = 'r';

		$config_field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setMethods( [ 'get_identifier' ] )
			->setConstructorArgs( [ $field, $component ] )
			->getMock();

		$config_field
			->expects( $this->exactly( 1 ) )
			->method( 'get_identifier' )
			->will( $this->returnValue( $field ) );

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'set', 'get' ] )
			->getMock();

		$adapter
			->expects( $this->once() )
			->method( 'set' )
			->will( $this->returnValue( true ) );

		$adapter
			->expects( $this->once() )
			->method( 'get' )
			->will( $this->returnValue( $return ) );

		$this->storage->set_adapter( $adapter );
		$this->storage->add_field( $config_field );

		$result = $this->storage->store( $data );

		$expected = [
			$field => [
				'result' => true,
				'data'   => $return,
			],
		];

		$this->assertEquals( $expected, $result );
	}
}
