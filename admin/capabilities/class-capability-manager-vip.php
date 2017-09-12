<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

final class WPSEO_Capability_Manager_VIP extends WPSEO_Abstract_Capability_Manager {
	/**
	 * Adds the registerd capabilities to the system.
	 */
	public function add() {
		$add_role_caps = array();
		foreach ( $this->capabilities as $capability => $roles ) {
			// Allow filtering of roles.
			$filtered_roles = $this->filter_roles( $capability, $roles );

			foreach ( $filtered_roles as $role ) {
				if ( ! isset( $add_role_caps[ $role ] ) ) {
					$add_role_caps[ $role ] = array();
				}
				$add_role_caps[ $role ][] = $capability;
			}
		}

		foreach ( $add_role_caps as $role => $capabilities ) {
			wpcom_vip_add_role_caps( $role, array( $capabilities ) );
		}
	}

	/**
	 * Removes the registered capabilities from the system
	 */
	public function remove() {
		// Remove from any role it has been added to.
		$roles = wp_roles()->get_names();
		$roles = array_keys( $roles );

		$add_role_caps = array();
		foreach ( $this->capabilities as $capability => $_roles ) {
			// Allow filtering of roles.
			$filtered_roles = $this->filter_roles( $capability, $roles );

			foreach ( $filtered_roles as $role ) {
				if ( ! isset( $add_role_caps[ $role ] ) ) {
					$add_role_caps[ $role ] = array();
				}
				$add_role_caps[ $role ][] = $capability;
			}
		}

		foreach ( $add_role_caps as $role => $capabilities ) {
			wpcom_vip_remove_role_caps( $role, array( $capabilities ) );
		}
	}
}
