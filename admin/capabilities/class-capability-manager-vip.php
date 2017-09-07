<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

class WPSEO_Capability_Manager_VIP implements WPSEO_Capability_Manager {
	protected $capabilities = array();

	/**
	 * Registers a capability.
	 *
	 * @param string $capability Capability to add.
	 * @param array  $roles      Roles to add the capability to.
	 */
	public function register( $capability, array $roles ) {
		$this->capabilities[ $capability ] = $roles;
	}

	/**
	 *
	 */
	public function add() {

		$add_role_caps = array();
		foreach( $this->capabilities as $capability => $roles ) {
			// Allow filtering of roles.
			$filtered_roles = $this->filter_roles( $capability, $roles );

			foreach ($filtered_roles as $role) {
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
	 *
	 */
	public function remove() {
		// Remove from any role it has been added to.
		$roles = array(
			'administrator',
			'editor',
			'author',
			'contributor'
		);

		$add_role_caps = array();
		foreach( $this->capabilities as $capability => $roles ) {
			// Allow filtering of roles.
			$filtered_roles = $this->filter_roles( $capability, $roles );

			foreach ($filtered_roles as $role) {
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

	/**
	 * @param array $roles
	 *
	 * @return WP_Role[] List of WP_Role objects.
	 */
	protected function get_wp_roles( array $roles ) {
		$wp_roles = array_map( 'get_role', $roles );
		return array_filter($wp_roles );
	}

	/**
	 * @param string $capability
	 * @param array $roles
	 *
	 * @return array
	 */
	protected function filter_roles( $capability, array $roles ) {
		/**
		 *
		 */
		return apply_filters( $capability . '_roles', $roles );
	}

	/**
	 * @return string[] List of registered capabilities
	 */
	public function get_capabilities() {
		return array_keys( $this->capabilities );
	}
}
