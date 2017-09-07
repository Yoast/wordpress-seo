<?php
/**
 * @package WPSEO\Admin\Roles
 */

abstract class WPSEO_Abstract_Role_Manager implements WPSEO_Role_Manager {
	protected $roles = array();

	/**
	 * Registers a role.
	 *
	 * @param string $role                  Role to add.
	 * @param string $display_name          Display name to use.
	 * @param array  $enabled_capabilities  Optional. List of capabilities that must be granted.
	 * @param array  $disabled_capabilities Optional. List of capabilities that must be restricted.
	 *
	 * @return void
	 */
	public function register( $role, $display_name, array $enabled_capabilities = array(), array $disabled_capabilities = array() ) {
		$this->roles[ $role ] =
			(object) array(
				'display_name'          => $display_name,
				'enabled_capabilities'  => $enabled_capabilities,
				'disabled_capabilities' => $disabled_capabilities
			);
	}

	/**
	 * Returns the list of registered roles.
	 *
	 * @return string[] List or registered roles.
	 */
	public function get_roles() {
		return array_keys( $this->roles );
	}

	/**
	 * Adds the registered roles.
	 *
	 * @return void
	 */
	public function add() {
		foreach ( $this->roles as $role => $data ) {
			$this->add_role( $role, $data );
		}
	}

	/**
	 * Removes the registered roles.
	 *
	 * @return void
	 */
	public function remove() {
		$roles = array_keys( $this->roles );
		array_map( array( $this, 'remove_role' ), $roles );
	}

	/**
	 * Adds a role to the system.
	 *
	 * @param string $role Role to add.
	 * @param object $data Data to use to add the role.
	 *
	 * @return void
	 */
	abstract protected function add_role( $role, $data );

	/**
	 * Removes a role from the system
	 *
	 * @param string $role Role to remove.
	 *
	 * @return void
	 */
	abstract protected function remove_role( $role );
}
