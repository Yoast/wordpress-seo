<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

/**
 * Class WPSEO_Configuration_Components_Tests
 */
class WPSEO_Configuration_Components_Tests extends PHPUnit_Framework_TestCase {

	/** @var WPSEO_Configuration_Components_Mock */
	protected $components;

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->components = new WPSEO_Configuration_Components_Mock();
	}

	/**
	 * @covers WPSEO_Configuration_Components::initialize()
	 */
	public function test_constructor() {
		$components = new WPSEO_Configuration_Components_Mock();
		$components->initialize();

		$list = $components->get_components();
		$this->assertEquals( 4, count( $list ) );
	}

	/**
	 * @covers WPSEO_Configuration_Components::add_component()
	 */
	public function test_add_component() {
		$component = $this->getMockBuilder( 'WPSEO_Config_Component' )->getMock();

		$this->assertNull( $this->components->add_component( $component ) );

		$this->assertTrue( in_array( $component, $this->components->get_components(), true ) );
	}

	/**
	 * @covers WPSEO_Configuration_Components::set_adapter()
	 */
	public function test_set_adapter() {
		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( array( 'add_custom_lookup' ) )
			->getMock();

		$adapter
			->expects( $this->exactly( 1 ) )
			->method( 'add_custom_lookup' );

		$component = $this
			->getMockBuilder( 'WPSEO_Config_Component' )
			->setMethods( array( 'get_field', 'get_identifier', 'get_data', 'set_data' ) )
			->getMock();

		$field = new WPSEO_Config_Field( 'a', 'b' );

		$component
			->expects( $this->once() )
			->method( 'get_field' )
			->will( $this->returnValue( $field ) );

		$this->components->add_component( $component );

		$this->components->set_adapter( $adapter );
	}

	/**
	 * @covers WPSEO_Configuration_Components::set_storage()
	 */
	public function test_set_storage() {
		$storage = $this
			->getMockBuilder( 'WPSEO_Configuration_Storage' )
			->setMethods( array( 'get_adapter' ) )
			->getMock();

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->getMock();

		$storage
			->expects( $this->once() )
			->method( 'get_adapter' )
			->will( $this->returnValue( $adapter ) );

		$this->assertNull( $this->components->set_storage( $storage ) );
		$this->assertEquals( $adapter, $this->components->get_adapter() );
	}

	/**
	 * @covers WPSEO_Configuration_Components::set_storage()
	 */
	public function test_set_storage_on_field() {
		$component = $this
			->getMockBuilder( 'WPSEO_Config_Component' )
			->setMethods( array(
				'get_field',
				'get_identifier',
				'set_data',
				'get_data',
			) )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( 'a', 'b' ) )
			->getMock();

		$component
			->expects( $this->exactly( 2 ) )
			->method( 'get_field' )
			->will( $this->returnValue( $field ) );

		$storage = $this
			->getMockBuilder( 'WPSEO_Configuration_Storage' )
			->setMethods( array( 'get_adapter', 'add_field' ) )
			->getMock();

		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->getMock();

		$storage
			->expects( $this->once() )
			->method( 'add_field' )
			->with( $field );

		$storage
			->expects( $this->once() )
			->method( 'get_adapter' )
			->will( $this->returnValue( $adapter ) );

		$this->components->add_component( $component );
		$this->components->set_storage( $storage );
	}
}
