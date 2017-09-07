<?php
/**
 * @package WPSEO\Admin\Roles
 */

final class WPSEO_Role_Manager_WP extends WPSEO_Abstract_Role_Manager {

	/**
	 * Adds a role to the system.
	 *
	 * @param string $role Role to add.
	 * @param object $data Data to use to add the role.
	 *
	 * @return void
	 */
	protected function add_role( $role, $data ) {
		$capabilities = array_merge( $this->format_capabilities( $data->enabled_capabilities ), $this->format_capabilities( $data->disabled_capabilities ) );
		add_role( $role, $data->display_name, $capabilities );
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

	/**
	 * Formats the capabilities to the required format.
	 *
	 * @param array $capabilities Capabilities to format.
	 * @param bool  $enabled      Should this capability be enabled.
	 *
	 * @return array
	 */
	protected function format_capabilities( array $capabilities, $enabled = true ) {
		// Flip keys and values.
		array_flip( $capabilities );

		// Set all values to $enabled.
		return array_fill_keys( array_keys( $capabilities ), $enabled );
	}
}
