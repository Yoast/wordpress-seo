<?php
/**
 * @package WPSEO\UnitTests
 */

/**
 * Class WPSEO_Configuration_Components_Mock
 */
class WPSEO_Configuration_Components_Mock extends WPSEO_Configuration_Components {

	/**
	 * WPSEO_Configuration_Components_Mock constructor.
	 *
	 * Removes default registrations
	 */
	public function __construct() {
	}

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

/**
 * Class WPSEO_Configuration_Components_Tests
 */
class WPSEO_Configuration_Components_Tests extends WPSEO_UnitTestCase {

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
	 * @covers WPSEO_Configuration_Components::add_component()
	 */
	public function test_add_component() {
		$component = $this->getMockBuilder( WPSEO_Config_Component::class )->getMock();

		$this->assertNull( $this->components->add_component( $component ) );

		$this->assertTrue( in_array( $component, $this->components->get_components(), true ) );
	}

	/**
	 * @covers WPSEO_Configuration_Components::set_adapter()
	 */
	public function test_set_adapter() {
		$adapter = $this
			->getMockBuilder( WPSEO_Configuration_Options_Adapter::class )
			->setMethods( array( 'add_custom_lookup' ) )
			->getMock();

		$adapter
			->expects( $this->exactly( 1 ) )
			->method( 'add_custom_lookup' );

		$component = $this->getMockBuilder( WPSEO_Config_Component::class )->getMock();
		$this->components->add_component( $component );

		$this->components->set_adapter( $adapter );
	}

	/**
	 * @covers WPSEO_Configuration_Components::set_storage()
	 */
	public function test_set_storage() {
		$storage = $this
			->getMockBuilder( WPSEO_Configuration_Storage::class )
			->setMethods( array( 'get_adapter' ) )
			->getMock();

		$adapter = $this
			->getMockBuilder( WPSEO_Configuration_Options_Adapter::class )
			->getMock();

		$storage
			->expects( $this->once() )
			->method( 'get_adapter' )
			->willReturn( $adapter );

		$this->assertNull( $this->components->set_storage( $storage ) );
		$this->assertEquals( $adapter, $this->components->get_adapter() );
	}
}
