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

	public function test_register() {
		$instance = new WPSEO_Capability_Manager_Double();

		$this->assertNotContains( 'capability', $instance->get_capabilities() );

		$instance->register( 'capability', array( 'role' ) );

		$this->assertContains( 'capability', $instance->get_capabilities() );

		$registered = $instance->get_registered_capabilities();
		$this->assertContains( 'role', $registered['capability'] );
	}

	public function test_register_overwrite() {
		$instance = new WPSEO_Capability_Manager_Double();

		$instance->register( 'capability', array( 'role1' ) );
		$instance->register( 'capability', array( 'role2' ), true );

		$this->assertContains( 'capability', $instance->get_capabilities() );

		$registered = $instance->get_registered_capabilities();
		$this->assertContains( 'role2', $registered['capability'] );
		$this->assertNotContains( 'role1', $registered['capability'] );
	}

	public function test_register_add() {
		$instance = new WPSEO_Capability_Manager_Double();

		$instance->register( 'capability', array( 'role1' ) );
		$instance->register( 'capability', array( 'role2' ) );

		$this->assertContains( 'capability', $instance->get_capabilities() );

		$registered = $instance->get_registered_capabilities();
		$this->assertContains( 'role2', $registered['capability'] );
		$this->assertContains( 'role1', $registered['capability'] );
	}

	public function test_filter_roles() {
		$instance = new WPSEO_Capability_Manager_Double();

		add_filter( 'capability_roles', array( $this, 'do_filter_roles' ) );

		$filtered = $instance->filter_roles( 'capability', array( 'role' ) );

		remove_filter( 'capability_roles', array( $this, 'do_filter_roles' ) );

		$this->assertEquals( $this->do_filter_roles( array( 'role' ) ), $filtered );
	}

	public function do_filter_roles( $roles ) {
		return array( 'elor' );
	}
}
