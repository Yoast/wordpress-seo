<?php
/**
 * @package WPSEO\Tests\Roles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Role_Manager_Test extends WPSEO_Abstract_Role_Manager {
	public $added_roles = array();
	public $removed_roles = array();

	public function get_registered_roles() {
		return $this->roles;
	}

	public function filter_existing_capabilties( $role, array $capabilities ) {
		return parent::filter_existing_capabilities( $role, $capabilities );
	}

	public function get_capabilities( $role ) {
		return parent::get_capabilities( $role );
	}

	/**
	 * Adds a role to the system.
	 *
	 * @param string $role         Role to add.
	 * @param string $display_name Name to display for the role.
	 * @param array  $capabilities Capabilities to add to the role.
	 *
	 * @return void
	 */
	protected function add_role( $role, $display_name, array $capabilities = array() ) {
		$this->added_roles[] = array(
			'role'         => $role,
			'display_name' => $display_name,
			'capabilities' => $capabilities,
		);
	}

	/**
	 * Removes a role from the system
	 *
	 * @param string $role Role to remove.
	 *
	 * @return void
	 */
	protected function remove_role( $role ) {
		$this->removed_roles[] = $role;
	}
}

/**
 * Unit Test Class.
 */
class Capability_Role_Tests extends PHPUnit_Framework_TestCase {
	public function test_register() {
		$instance = new WPSEO_Role_Manager_Test();

		$this->assertNotContains( 'role', $instance->get_roles() );

		$instance->register( 'role', 'My Role', array() );

		$this->assertContains( 'role', $instance->get_roles() );
	}

	public function test_get_capabilities() {
		$instance = new WPSEO_Role_Manager_Test();
		$capabilities = $instance->get_capabilities( 'administrator' );

		$this->assertNotEmpty( $capabilities );
		$this->assertContains( 'manage_options', array_keys( $capabilities ) );
		$this->assertTrue( $capabilities['manage_options'] );
	}

	public function test_get_capabilities_bad_input() {
		$instance = new WPSEO_Role_Manager_Test();

		$result = $instance->get_capabilities( false );
		$this->assertEquals( array(), $result );

		$result = $instance->get_capabilities( new StdClass() );
		$this->assertEquals( array(), $result );

		$result = $instance->get_capabilities( 'fake_role' );
		$this->assertEquals( array(), $result );
	}
}
