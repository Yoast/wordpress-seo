<?php
/**
 * @package WPSEO\Admin\Roles
 */

interface WPSEO_Role_Manager {
	/**
	 * Registers a role.
	 *
	 * @param string $role         Role to add.
	 * @param string $display_name Display name to use.
	 * @param null|string   $template     Optional. Role to base the new role on.
	 *
	 * @return
	 */
	public function register( $role, $display_name, $template = null );

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
