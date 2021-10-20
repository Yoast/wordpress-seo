<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Class WPSEO_Configuration_Components_Test.
 */
class WPSEO_Configuration_Components_Test extends TestCase {

	use Yoast_SEO_ReflectionToString_Deprecation_Handler;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Configuration_Components_Mock
	 */
	protected $components;

	/**
	 * Set up.
	 */
	public function set_up() {
		parent::set_up();

		$this->components = new WPSEO_Configuration_Components_Mock();
	}

	/**
	 * Tests adding a component.
	 *
	 * @covers WPSEO_Configuration_Components::add_component
	 */
	public function test_add_component() {
		$component = $this->getMockBuilder( 'WPSEO_Config_Component' )->getMock();

		$this->assertNull( $this->components->add_component( $component ) );

		$this->assertTrue( in_array( $component, $this->components->get_components(), true ) );
	}

	/**
	 * Tests setting the adapter.
	 *
	 * @covers WPSEO_Configuration_Components::set_adapter
	 */
	public function test_set_adapter() {
		$adapter = $this
			->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )
			->setMethods( [ 'add_custom_lookup' ] )
			->getMock();

		$adapter
			->expects( $this->exactly( 1 ) )
			->method( 'add_custom_lookup' );

		$component = $this
			->getMockBuilder( 'WPSEO_Config_Component' )
			->setMethods( [ 'get_field', 'get_identifier', 'get_data', 'set_data' ] )
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
	 * Tests setting the storage.
	 *
	 * @covers WPSEO_Configuration_Components::set_storage
	 */
	public function test_set_storage() {

		$this->expect_reflection_deprecation_warning_php74();

		$storage = $this
			->getMockBuilder( 'WPSEO_Configuration_Storage' )
			->setMethods( [ 'get_adapter' ] )
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
	 * Tests setting the storage on the field.
	 *
	 * @covers WPSEO_Configuration_Components::set_storage
	 */
	public function test_set_storage_on_field() {

		$this->expect_reflection_deprecation_warning_php74();

		$component = $this
			->getMockBuilder( 'WPSEO_Config_Component' )
			->setMethods( [ 'get_field', 'get_identifier', 'set_data', 'get_data' ] )
			->getMock();

		$field = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( [ 'a', 'b' ] )
			->getMock();

		$component
			->expects( $this->exactly( 2 ) )
			->method( 'get_field' )
			->will( $this->returnValue( $field ) );

		$storage = $this
			->getMockBuilder( 'WPSEO_Configuration_Storage' )
			->setMethods( [ 'get_adapter', 'add_field' ] )
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
