<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\License_Manager
 */

/**
 * Class WPSEO_Plugin_License_Manager
 */
class WPSEO_Plugin_License_Manager extends WPSEO_License_Manager {
	/**
	 * Class constructor.
	 *
	 * @param WPSEO_Product $product
	 */
	public function __construct( WPSEO_Product $product ) {

		parent::__construct( $product );

		// Check if plugin is network activated. We should use site(wide) options in that case.
		if ( is_admin() && is_multisite() ) {

			if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$this->is_network_activated = is_plugin_active_for_network( $product->get_file() );
		}
	}

	/**
	 * Setup auto updater for plugins.
	 *
	 * @return void
	 */
	public function setup_auto_updater() {
		/**
		 * Filter: 'yoast-license-valid' - Perform action when license is valid or hook returns true.
		 *
		 * @api bool $is_valid True if the license is valid.
		 */
		if ( apply_filters( 'yoast-license-valid', $this->license_is_valid() ) ) {
			new WPSEO_Plugin_Update_Manager( $this->product, $this );
		}
	}

	/**
	 * Setup hooks.
	 *
	 * @return void
	 */
	public function specific_hooks() {
		// deactivate the license remotely on plugin deactivation
		register_deactivation_hook( $this->product->get_file(), array( $this, 'deactivate_license' ) );
	}
}
