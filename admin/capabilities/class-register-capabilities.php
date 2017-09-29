<?php
/**
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
		add_action( 'wpseo_register_capabilities', array( $this, 'register' ) );
		add_filter( 'members_get_capabilities', array( $this, 'get_capabilities' ) );
		add_action( 'members_register_cap_groups', array( $this, 'action_members_register_cap_group' ) );
	}

	/**
	 * Registers the capabilities.
	 *
	 * @return void
	 */
	public function register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$manager->register( 'wpseo_bulk_edit', array( 'editor', 'wpseo_editor', 'wpseo_manager' ) );
		$manager->register( 'wpseo_edit_advanced_metadata', array( 'wpseo_editor', 'wpseo_manager' ) );

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

	/**
	 * Get the Yoast SEO capabilities.
	 * Optionally append them to an existing array.
	 *
	 * @param  array $caps Optional existing capability list.
	 * @return array
	 */
	public function get_capabilities( $caps = array() ) {
		if ( ! did_action( 'wpseo_register_capabilities' ) ) {
			do_action( 'wpseo_register_capabilities' );
		}

		$manager = WPSEO_Capability_Manager_Factory::get();

		return array_merge( $caps, $manager->get_capabilities() );
	}

	/**
	 * Add capabilities to its own group in the Members plugin.
	 *
	 * @see  members_register_cap_group()
	 */
	public function action_members_register_cap_group() {
		if ( ! function_exists( 'members_register_cap_group' ) ) {
			return;
		}
		// Register the yoast group.
		members_register_cap_group( 'wordpress-seo',
			array(
				'label'      => esc_html__( 'Yoast SEO', 'wordpress-seo' ),
				'caps'       => $this->get_capabilities(),
				'icon'       => '', // WPSEO_Utils::get_icon_svg(), SVG not working.
				'diff_added' => true,
			)
		);
	}
}
