<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Integrates Yoast SEO capabilities with Members and other plugins that use the same filter.
 */
class WPSEO_Capability_Members_Integration {
	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'members_get_capabilities', array( $this, 'get_capabilities' ) );
		add_action( 'members_register_cap_groups', array( $this, 'action_members_register_cap_group' ) );
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
