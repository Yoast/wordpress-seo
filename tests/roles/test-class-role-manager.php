<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Roles
 */

/**
 * Unit Test Class.
 */
class Capability_Role_Tests extends PHPUnit_Framework_TestCase {

	public function test_register() {
		$instance = new WPSEO_Role_Manager_Mock();

		$this->assertNotContains( 'role', $instance->get_roles() );

		$instance->register( 'role', 'My Role', array() );

		$this->assertContains( 'role', $instance->get_roles() );
	}

	public function test_get_capabilities() {
		$instance     = new WPSEO_Role_Manager_Mock();
		$capabilities = $instance->get_capabilities( 'administrator' );

		$this->assertNotEmpty( $capabilities );
		$this->assertContains( 'manage_options', array_keys( $capabilities ) );
		$this->assertTrue( $capabilities['manage_options'] );
	}

	public function test_get_capabilities_bad_input() {
		$instance = new WPSEO_Role_Manager_Mock();

		$result = $instance->get_capabilities( false );
		$this->assertEquals( array(), $result );

		$result = $instance->get_capabilities( new StdClass() );
		$this->assertEquals( array(), $result );

		$result = $instance->get_capabilities( 'fake_role' );
		$this->assertEquals( array(), $result );
	}
}
