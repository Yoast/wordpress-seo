<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Roles
 */

use Brain\Monkey;

/**
 * Unit Test Class.
 */
class Capability_Role extends \Yoast\Tests\TestCase {

	public function test_register() {
		$instance = new WPSEO_Role_Manager_Mock();

		$this->assertNotContains( 'role', $instance->get_roles() );

		$instance->register( 'role', 'My Role', array() );

		$this->assertContains( 'role', $instance->get_roles() );
	}

	public function test_get_capabilities() {
		$instance     = new WPSEO_Role_Manager_Mock();

		Monkey\Functions\expect('get_role' )
			->once()
			->with( 'administrator' )
			->andReturn( (object) array( "capabilities" => array( "manage_options" => true ) ) );

		$capabilities = $instance->get_capabilities( 'administrator' );

		$this->assertNotEmpty( $capabilities );
		$this->assertContains( 'manage_options', array_keys( $capabilities ) );
		$this->assertTrue( $capabilities['manage_options'] );
	}

	public function test_get_capabilities_bad_input() {
		$instance = new WPSEO_Role_Manager_Mock();

		Monkey\Functions\expect('get_role' )
			->once()
			->with( 'fake_role' )
			->andReturn( false );

		$result = $instance->get_capabilities( false );
		$this->assertEquals( array(), $result );

		$result = $instance->get_capabilities( new StdClass() );
		$this->assertEquals( array(), $result );

		$result = $instance->get_capabilities( 'fake_role' );
		$this->assertEquals( array(), $result );
	}
}
