<?php

class WPSEO_Register_Roles implements WPSEO_WordPress_Integration {
	/**
	 * Adds hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_register_roles', array( $this, 'register' ) );
	}

	/**
	 * Registers the roles.
	 */
	public function register() {
		$role_manager = WPSEO_Role_Manager_Factory::get();

		// Add all `wpseo_*` capabilities to the manager.
		$capability_manager = WPSEO_Capability_Manager_Factory::get();
		$role_manager->register( 'wpseo_manager', 'SEO Manager', $capability_manager->get_capabilities() );

		// Only add specific editor capabilities.
		$role_manager->register( 'wpseo_editor', 'SEO Editor', array(
			'wpseo_bulk_edit',
			'wpseo_manage_redirects',
			'wpseo_edit_advanced_metadata'
		) );
	}
}
