<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

/**
 * Class WPSEO_Configuration_Storage_Test
 */
class WPSEO_Configuration_Storage_Test extends PHPUnit_Framework_TestCase {
	/** @var WPSEO_Configuration_Storage_Mock */
	protected $storage;

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->storage = new WPSEO_Configuration_Storage_Mock();
	}

	/**
	 * @covers WPSEO_Configuration_Storage::add_field()
	 */
	public function test_add_field() {
		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( 'field', 'component' ) )
			->getMock();

		$this->assertNull( $this->storage->add_field( $field ) );
		$this->assertEquals( array( $field ), $this->storage->get_fields() );
	}

	/**
	 * @covers WPSEO_Configuration_Storage::set_adapter()
	 * @covers WPSEO_Configuration_Storage::get_adapter()
	 */
	public function test_set_adapter() {
		$adapter = new WPSEO_Configuration_Options_Adapter();

		$this->assertNull( $this->storage->set_adapter( $adapter ) );
		$this->assertEquals( $adapter, $this->storage->get_adapter() );
	}

	/**
	 * @covers WPSEO_Configuration_Storage::is_not_null()
	 */
	public function test_is_not_null() {
		$this->assertTrue( $this->storage->is_not_null( '1' ) );
		$this->assertFalse( $this->storage->is_not_null( null ) );
	}

	/**
	 * Test get field data with string
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data()
	 */
	public function test_get_field_data_null() {
		$data = null;

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'get' ) )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( 'field', 'type' ) )
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
	 * Test get field data default Field value
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data()
	 */
	public function test_get_field_data_field_default() {
		$data    = null;
		$default = 'default';

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'get' ) )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( 'field', 'type' ) )
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
	 * Test get field data with string
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data()
	 */
	public function test_get_field_data_string() {
		$data = 'data';

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'get' ) )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( 'field', 'type' ) )
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
	 * Test get field data with string
	 *
	 * @covers WPSEO_Configuration_Storage::get_field_data()
	 */
	public function test_get_field_data_array() {
		$data    = array( 'a' => '1' );
		$default = array(
			'a' => '2',
			'b' => '2',
		);

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'get' ) )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( 'field', 'type' ) )
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
			array(
				'a' => '1',
				'b' => '2',
			),
			$this->storage->get_field_data( $field )
		);
	}

	/**
	 * @covers WPSEO_Configuration_Storage::retrieve()
	 */
	public function test_retrieve() {
		$field          = 'f';
		$component      = 'c';
		$property       = 'p';
		$property_value = 'pv';
		$data           = 'd';

		$expected = array(
			$field => array(
				'componentName' => $component,
				'properties'    => array(
					$property => $property_value,
				),
				'data'          => $data,
			),
		);

		$config_field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setMethods( array( 'get_identifier', 'get_properties' ) )
			->setConstructorArgs( array( $field, $component ) )
			->getMock();

		$config_field
			->expects( $this->once() )
			->method( 'get_identifier' )
			->will( $this->returnValue( $field ) );

		$config_field
			->expects( $this->once() )
			->method( 'get_properties' )
			->will( $this->returnValue( array( $property => $property_value ) ) );

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'get' ) )
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
	 * @covers WPSEO_Configuration_Storage::store
	 */
	public function test_store() {
		$field     = 'f';
		$component = 'c';
		$data      = array( $field => array( 'data' => 'some_data' ) );
		$return    = 'r';

		$config_field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setMethods( array( 'get_identifier' ) )
			->setConstructorArgs( array( $field, $component ) )
			->getMock();

		$config_field
			->expects( $this->exactly( 1 ) )
			->method( 'get_identifier' )
			->will( $this->returnValue( $field ) );

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'set', 'get' ) )
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

		$expected = array(
			$field => array(
				'result' => true,
				'data'   => $return,
			),
		);

		$this->assertEquals( $expected, $result );
	}
}
