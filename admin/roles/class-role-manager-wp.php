<?php

class WPSEO_Role_Manager_WP implements WPSEO_Role_Manager {
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
	 * Adds the registered roles.
	 */
	public function add() {
		foreach ( $this->roles as $role => $data ) {
			$capabilities = array_merge( $this->format_capabilities( $data->enabled_capabilities ), $this->format_capabilities( $data->disabled_capabilities ) );
			add_role( $role, $data->display_name, $capabilities );
		}
	}

	/**
	 * Removes the registered roles.
	 */
	public function remove() {
		$roles = array_keys( $this->roles );
		array_map( 'remove_role', $roles );
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
	 * Formats the capabilities to the required format.
	 *
	 * @param array $capabilities Capabilities to format.
	 *
	 * @param bool  $enabled      Should this capability be enabled.
	 *
	 * @return array
	 */
	protected function format_capabilities( array $capabilities, $enabled = true ) {
		array_flip( $capabilities );

		// Set all values to 'true'.
		return array_fill_keys( array_keys( $capabilities ), $enabled );
	}
}
