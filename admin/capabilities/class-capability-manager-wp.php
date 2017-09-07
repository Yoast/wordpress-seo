<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

class WPSEO_Capability_Manager_WP implements WPSEO_Capability_Manager {
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
	 * Returns the list of registered capabilities
	 *
	 * @return string[] List of registered capabilities
	 */
	public function get_capabilities() {
		return array_keys( $this->capabilities );
	}

	/**
	 * Adds the capabilities to the roles.
	 */
	public function add() {
		foreach ( $this->capabilities as $capability => $roles ) {
			$filtered_roles = $this->filter_roles( $capability, $roles );

			$wp_roles = $this->get_wp_roles( $filtered_roles );
			foreach ( $wp_roles as $wp_role ) {
				$wp_role->add_cap( $capability );
			}
		}
	}

	/**
	 * Unregisters the capabilities from the system.
	 */
	public function remove() {
		$roles = wp_roles()->get_names();

		foreach ( $this->capabilities as $capability => $capability_roles ) {
			$registered_roles = array_unique( array_merge( $roles, $this->capabilities[ $capability ] ) );

			// Allow filtering of roles.
			$filtered_roles = $this->filter_roles( $capability, $registered_roles );

			$wp_roles = $this->get_wp_roles( $filtered_roles );
			foreach ( $wp_roles as $wp_role ) {
				$wp_role->remove_cap( $capability );
			}
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
}
