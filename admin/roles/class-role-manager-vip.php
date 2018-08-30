<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Roles
 */

/**
 * VIP implementation of the Role Manager.
 */
final class WPSEO_Role_Manager_VIP extends WPSEO_Abstract_Role_Manager {

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
		$enabled_capabilities  = array();
		$disabled_capabilities = array();

		// Build lists of enabled and disabled capabilities.
		foreach ( $capabilities as $capability => $grant ) {
			if ( $grant ) {
				$enabled_capabilities[] = $capability;
			}

			if ( ! $grant ) {
				$disabled_capabilities[] = $capability;
			}
		}

		wpcom_vip_add_role( $role, $display_name, $enabled_capabilities );
		if ( $disabled_capabilities !== array() ) {
			wpcom_vip_remove_role_caps( $role, $disabled_capabilities );
		}
	}

	/**
	 * Removes a role from the system.
	 *
	 * @param string $role Role to remove.
	 *
	 * @return void
	 */
	protected function remove_role( $role ) {
		remove_role( $role );
	}
}
