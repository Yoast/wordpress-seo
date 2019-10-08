<?php

namespace Yoast\WP\Free\Tests\Roles;

use Brain\Monkey;
use WPSEO_Role_Manager_Mock;
use Yoast\WP\Free\Tests\TestCase;
use stdClass;

/**
 * Unit Test Class.
 */
class Role_Manager_Test extends TestCase {

	public function test_register() {
		$instance = new WPSEO_Role_Manager_Mock();

		$this->assertNotContains( 'role', $instance->get_roles() );

		$instance->register( 'role', 'My Role', [] );

		$this->assertContains( 'role', $instance->get_roles() );
	}

	public function test_get_capabilities() {
		$instance = new WPSEO_Role_Manager_Mock();

		Monkey\Functions\expect( 'get_role' )
			->once()
			->with( 'administrator' )
			->andReturn( (object) [ 'capabilities' => [ 'manage_options' => true ] ] );

		$capabilities = $instance->get_capabilities( 'administrator' );

		$this->assertNotEmpty( $capabilities );
		$this->assertArrayHasKey( 'manage_options', $capabilities );
		$this->assertTrue( $capabilities['manage_options'] );
	}

	public function test_get_capabilities_bad_input() {
		$instance = new WPSEO_Role_Manager_Mock();

		Monkey\Functions\expect( 'get_role' )
			->once()
			->with( 'fake_role' )
			->andReturn( false );

		$result = $instance->get_capabilities( false );
		$this->assertSame( [], $result );

		$result = $instance->get_capabilities( new stdClass() );
		$this->assertSame( [], $result );

		$result = $instance->get_capabilities( 'fake_role' );
		$this->assertSame( [], $result );
	}
}
