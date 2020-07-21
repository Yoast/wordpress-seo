<?php

namespace Yoast\WP\SEO\Tests\Admin\Roles;

use Brain\Monkey;
use stdClass;
use WPSEO_Role_Manager_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 */
class Role_Manager_Test extends TestCase {

	/**
	 * Tests the registration of a role.
	 *
	 * @covers WPSEO_Abstract_Role_Manager::register
	 */
	public function test_register() {
		$instance = new WPSEO_Role_Manager_Mock();

		$this->assertNotContains( 'role', $instance->get_roles() );

		$instance->register( 'role', 'My Role', [] );

		$this->assertContains( 'role', $instance->get_roles() );
	}

	/**
	 * Tests the retrieval of the capabilities.
	 *
	 * @covers WPSEO_Abstract_Role_Manager::get_capabilities
	 */
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

	/**
	 * Tests retrieval of capabilities with bad input given.
	 *
	 * @covers WPSEO_Abstract_Role_Manager::get_capabilities
	 */
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
