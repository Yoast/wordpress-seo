<?php

class WPSEO_Register_Capabilities implements WPSEO_WordPress_Integration {
	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_register_capabilities', array( $this, 'register' ) );
	}

	/**
	 * Registers the capabilities.
	 */
	public function register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$manager->register( 'wpseo_bulk_edit', array( 'administrator', 'editor' ) );
		$manager->register( 'wpseo_manage_options', array( 'administrator', 'editor' ) );
	}
}
