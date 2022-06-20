<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Capabilities registration class.
 */
class WPSEO_Register_Capabilities implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_register_capabilities', [ $this, 'register' ] );

		if ( is_multisite() ) {
			add_action( 'user_has_cap', [ $this, 'filter_user_has_wpseo_manage_options_cap' ], 10, 4 );
		}

		add_action( 'admin_init', [ $this, 'extend_wpseo_manager_capabilities' ], 10 );
	}

	/**
	 * Registers the capabilities.
	 *
	 * @return void
	 */
	public function register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$manager->register( 'wpseo_bulk_edit', [ 'editor', 'wpseo_editor', 'wpseo_manager' ] );
		$manager->register( 'wpseo_edit_advanced_metadata', [ 'editor', 'wpseo_editor', 'wpseo_manager' ] );

		$manager->register( 'wpseo_manage_options', [ 'administrator', 'wpseo_manager' ] );
		$manager->register( 'view_site_health_checks', [ 'wpseo_manager' ] );
	}

	/**
	 * Revokes the 'wpseo_manage_options' capability from administrator users if it should
	 * only be granted to network administrators.
	 *
	 * @param array   $allcaps An array of all the user's capabilities.
	 * @param array   $caps    Actual capabilities being checked.
	 * @param array   $args    Optional parameters passed to has_cap(), typically object ID.
	 * @param WP_User $user    The user object.
	 *
	 * @return array Possibly modified array of the user's capabilities.
	 */
	public function filter_user_has_wpseo_manage_options_cap( $allcaps, $caps, $args, $user ) {

		// We only need to do something if 'wpseo_manage_options' is being checked.
		if ( ! in_array( 'wpseo_manage_options', $caps, true ) ) {
			return $allcaps;
		}

		// If the user does not have 'wpseo_manage_options' anyway, we don't need to revoke access.
		if ( empty( $allcaps['wpseo_manage_options'] ) ) {
			return $allcaps;
		}

		// If the user does not have 'delete_users', they are not an administrator.
		if ( empty( $allcaps['delete_users'] ) ) {
			return $allcaps;
		}

		$options = WPSEO_Options::get_instance();

		if ( $options->get( 'access' ) === 'superadmin' && ! is_super_admin( $user->ID ) ) {
			unset( $allcaps['wpseo_manage_options'] );
		}

		return $allcaps;
	}

	/**
	 * Action on admin_init that checks if the current user should have added capabilities to.
	 *
	 * @return void
	 */
	public function extend_wpseo_manager_capabilities() {
		$user = wp_get_current_user();

		if ( in_array( 'wpseo_manager', $user->roles, true ) ) {
			add_action( 'map_meta_cap', [ $this, 'add_manage_privacy_options_capability' ], 1, 2 );
		}
	}

	/**
	 * Action on map_meta_cap that allows SEO Managers to edit the privacy page.
	 *
	 * @param array  $caps The capabilities for the current user.
	 * @param string $cap The required capability.
	 * @return array|mixed
	 */
	public function add_manage_privacy_options_capability( $caps, $cap ) {
		if ( $cap === 'manage_privacy_options' ) {
			$caps = array_diff( $caps, [ 'manage_options' ] );
		}
		return $caps;
	}
}
