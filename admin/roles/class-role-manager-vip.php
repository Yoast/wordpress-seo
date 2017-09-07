<?php
/**
 * @package WPSEO\Admin\Roles
 */

final class WPSEO_Role_Manager_VIP extends WPSEO_Abstract_Role_Manager {
	/**
	 * Adds a role to the system.
	 *
	 * @param string $role Role to add.
	 * @param object $data Data to use to add the role.
	 *
	 * @return void
	 */
	protected function add_role( $role, $data ) {
		wpcom_vip_add_role( $role, $data->display_name, $data->enabled_capabilities );
		if ( array() !== $data->disabled_capabilities ) {
			wpcom_vip_remove_role_caps( $role, $data->disabled_capabilities );
		}
	}

	/**
	 * Removes a role from the system
	 *
	 * @param string $role Role to remove.
	 *
	 * @return void
	 */
	protected function remove_role( $role ) {
		remove_role( $role );
	}
}
