<?php
/**
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Role_Manager_Mock extends WPSEO_Abstract_Role_Manager {
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
