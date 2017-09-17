<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

abstract class WPSEO_Abstract_Capability_Manager implements WPSEO_Capability_Manager {
	protected $capabilities = array();

	/**
	 * Registers a capability.
	 *
	 * @param string $capability Capability to add.
	 * @param array  $roles      Roles to add the capability to.
	 * @param bool   $add        Optional. Use add or overwrite as registration method.
	 */
	public function register( $capability, array $roles, $add = true ) {
		if ( ! $add || ! isset( $this->capabilities[ $capability ] ) ) {
			$this->capabilities[ $capability ] = $roles;

			return;
		}

		// Combine configurations.
		$this->capabilities[ $capability ] = array_merge( $roles, $this->capabilities[ $capability ] );

		// Remove doubles.
		$this->capabilities[ $capability ] = array_unique( $this->capabilities[ $capability ] );
	}

	/**
	 * @return string[] List of registered capabilities
	 */
	public function get_capabilities() {
		return array_keys( $this->capabilities );
	}

	/**
	 * @param array $roles
	 *
	 * @return WP_Role[] List of WP_Role objects.
	 */
	protected function get_wp_roles( array $roles ) {
		$wp_roles = array_map( 'get_role', $roles );

		return array_filter( $wp_roles );
	}

	/**
	 * Filter capability roles.
	 *
	 * @param string $capability Capability to filter roles for.
	 * @param array  $roles      Default roles.
	 *
	 * @return array Filtered list of roles for the capability.
	 */
	protected function filter_roles( $capability, array $roles ) {
		/**
		 * Filter: Allow changing roles that a capability is added to.
		 *
		 * @api array $roles The default roles to be filtered.
		 */
		$filtered = apply_filters( $capability . '_roles', $roles );

		// Make sure we have the expected type.
		if ( ! is_array( $filtered ) ) {
			return array();
		}

		return $filtered;
	}
}
