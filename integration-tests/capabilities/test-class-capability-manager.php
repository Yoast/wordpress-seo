<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Capabilities
 */

/**
 * Unit Test Class.
 */
class Capability_Manager_Tests extends PHPUnit_Framework_TestCase {

	/**
	 * Tests whether capabilities are correctly registered.
	 *
	 * @covers WPSEO_Capability_Manager::get_capabilities
	 * @covers WPSEO_Capability_Manager::register
	 */
	public function test_register() {
		$instance = new WPSEO_Capability_Manager_Double();

		$this->assertNotContains( 'capability', $instance->get_capabilities() );

		$instance->register( 'capability', array( 'role' ) );

		$this->assertContains( 'capability', $instance->get_capabilities() );

		$registered = $instance->get_registered_capabilities();
		$this->assertContains( 'role', $registered['capability'] );
	}

	/**
	 * Tests whether capabilities are correctly overwritten.
	 *
	 * @covers WPSEO_Capability_Manager::get_capabilities
	 * @covers WPSEO_Capability_Manager::register
	 */
	public function test_register_overwrite() {
		$instance = new WPSEO_Capability_Manager_Double();

		$instance->register( 'capability', array( 'role1' ) );
		$instance->register( 'capability', array( 'role2' ), true );

		$this->assertContains( 'capability', $instance->get_capabilities() );

		$registered = $instance->get_registered_capabilities();
		$this->assertContains( 'role2', $registered['capability'] );
		$this->assertNotContains( 'role1', $registered['capability'] );
	}

	/**
	 * Tests whether capabilities are correctly registered without overwriting each other.
	 *
	 * @covers WPSEO_Capability_Manager::get_capabilities
	 * @covers WPSEO_Capability_Manager::register
	 */
	public function test_register_add() {
		$instance = new WPSEO_Capability_Manager_Double();

		$instance->register( 'capability', array( 'role1' ) );
		$instance->register( 'capability', array( 'role2' ) );

		$this->assertContains( 'capability', $instance->get_capabilities() );

		$registered = $instance->get_registered_capabilities();
		$this->assertContains( 'role2', $registered['capability'] );
		$this->assertContains( 'role1', $registered['capability'] );
	}

	/**
	 * Tests whether capabilities are correctly filtered.
	 *
	 * @covers WPSEO_Abstract_Capability_Manager::filter_roles
	 */
	public function test_filter_roles() {
		$instance = new WPSEO_Capability_Manager_Double();

		add_filter( 'capability_roles', array( $this, 'do_filter_roles' ) );

		$filtered = $instance->filter_roles( 'capability', array( 'role' ) );

		remove_filter( 'capability_roles', array( $this, 'do_filter_roles' ) );

		$this->assertEquals( $this->do_filter_roles( array( 'role' ) ), $filtered );
	}

	/**
	 * Helper function used to filter the roles.
	 */
	public function do_filter_roles( $roles ) {
		return array( 'elor' );
	}
}
