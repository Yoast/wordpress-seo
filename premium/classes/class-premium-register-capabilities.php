<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Capabilities registration class.
 */
class WPSEO_Premium_Register_Capabilities implements WPSEO_WordPress_Integration {
	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_register_capabilities', array( $this, 'register' ) );
		add_filter( 'user_has_cap', array( $this, 'filter_user_caps' ) );
	}

	/**
	 * Registers the capabilities.
	 *
	 * @return void
	 */
	public function register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$manager->register( 'wpseo_manage_redirects', array( 'editor', 'wpseo_editor', 'wpseo_manager' ) );
	}

	/**
	 * Adds the `wpseo_manage_redirects` to the user if the user has `wpseo_manage_options`.
	 *
	 * @param array $capabilities Configured capabilities.
	 *
	 * @return array Filtered capabilities.
	 */
	public function filter_user_caps( $capabilities ) {
		// Add wpseo_mananage_redirects to wpso_manage_options if not already set.
		if ( ! array_key_exists( 'wpseo_manage_redirects', $capabilities )
			 && isset( $capabilities['wpseo_manage_options'] )
			 && $capabilities['wpseo_manage_options'] === true
		) {
			$capabilities['wpseo_manage_redirects'] = true;
		}

		return $capabilities;
	}
}
