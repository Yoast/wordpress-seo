<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Admin;

use WPSEO_Abstract_Role_Manager;

/**
 * Test Helper Class.
 */
class Role_Manager_Mock extends WPSEO_Abstract_Role_Manager {

	/**
	 * Added roles.
	 *
	 * @var array
	 */
	public $added_roles = [];

	/**
	 * Removed roles.
	 *
	 * @var array
	 */
	public $removed_roles = [];

	/**
	 * Get registered roles.
	 *
	 * @return array
	 */
	public function get_registered_roles() {
		return $this->roles;
	}

	/**
	 * Filters out capabilities that are already set for the role.
	 *
	 * This makes sure we don't override configurations that have been previously set.
	 *
	 * @param string $role         The role to check against.
	 * @param array  $capabilities The capabilities that should be set.
	 *
	 * @return array Capabilties that can be safely set.
	 */
	public function filter_existing_capabilties( $role, array $capabilities ) {
		return parent::filter_existing_capabilities( $role, $capabilities );
	}

	/**
	 * Returns the capabilities for the specified role.
	 *
	 * @param string $role Role to fetch capabilities from.
	 *
	 * @return array List of capabilities.
	 */
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
	protected function add_role( $role, $display_name, array $capabilities = [] ) {
		$this->added_roles[] = [
			'role'         => $role,
			'display_name' => $display_name,
			'capabilities' => $capabilities,
		];
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
