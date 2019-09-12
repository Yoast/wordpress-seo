<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   12.2
 */

/**
 * Represents the plugin installation feature.
 */
class WPSEO_Plugin_Installation implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Enqueues scripts.
	 */
	public function enqueue_scripts() {
		if ( 'wpseo_licenses' === filter_input( INPUT_GET, 'page' ) ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
			$asset_manager->enqueue_script( 'plugin-installation' );
		}
	}
}
