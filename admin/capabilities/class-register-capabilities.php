<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

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

		$manager->register( 'wpseo_bulk_edit', array( 'editor', 'wpseo_editor' ) );

		$manager->register( 'wpseo_manage_options', array( 'wpseo_manager' ) );

		/*
		 * Respect MultiSite 'access' setting if set to 'super admins only'.
		 * This means that local admins do not get the `wpseo_manage_options` capability.
		 */
		$ms_options = WPSEO_Options::get_option( 'ms' );
		if ( $ms_options['access'] !== 'superadmins' ) {
			$manager->register( 'wpseo_manage_options', array( 'administrator' ) );
		}
	}
}
