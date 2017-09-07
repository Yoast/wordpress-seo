<?php
/**
 * @package WPSEO\Admin\Roles
 */

interface WPSEO_Role_Manager {
	/**
	 * Registers a role.
	 *
	 * @param string $role                  Role to add.
	 * @param string $display_name          Display name to use.
	 * @param array  $enabled_capabilities  Optional. List of capabilities that must be granted.
	 * @param array  $disabled_capabilities Optional. List of capabilities that must be restricted.
	 *
	 * @internal param array $capabilities Capabilities to add.
	 */
	public function register( $role, $display_name, array $enabled_capabilities = array(), array $disabled_capabilities = array() );

	/**
	 * Adds the registered roles.
	 */
	public function add();

	/**
	 * Removes the registered roles.
	 */
	public function remove();

	/**
	 * Returns the list of registered roles.
	 *
	 * @return string[] List or registered roles.
	 */
	public function get_roles();
}
