<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Integrates Yoast SEO capabilities with third party role manager plugins.
 */
class WPSEO_Capability_Manager_Integration {
	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'members_get_capabilities', array( $this, 'get_capabilities' ) );
		add_action( 'members_register_cap_groups', array( $this, 'action_members_register_cap_group' ) );

		add_filter( 'ure_capabilities_groups_tree', array( $this, 'filter_ure_capabilities_groups_tree' ) );
		add_filter( 'ure_custom_capability_groups', array( $this, 'filter_ure_custom_capability_groups' ), 10, 2 );
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
				'caps'       => self::get_capabilities(),
				'icon'       => '', // WPSEO_Utils::get_icon_svg(), SVG not working.
				'diff_added' => true,
			)
		);
	}

	/**
	 * Add Yoast SEO capability group in the User Role Editor plugin.
	 *
	 * @see    URE_Capabilities_Groups_Manager::get_groups_tree()
	 * @param  array $groups Current groups.
	 * @return array
	 */
	public function filter_ure_capabilities_groups_tree( $groups = array() ) {
		$groups = (array) $groups;
		$groups['wordpress-seo'] = array(
			'caption' => esc_html__( 'Yoast SEO', 'wordpress-seo' ),
			'parent'  => 'custom',
			'level'   => 3,
		);
		return $groups;
	}

	/**
	 * Add capabilities to the Yoast SEO group in the User Role Editor plugin.
	 *
	 * @see    URE_Capabilities_Groups_Manager::get_cap_groups()
	 * @param  array  $groups Current capability groups.
	 * @param  string $cap_id Capability identifier.
	 * @return array
	 */
	public function filter_ure_custom_capability_groups( $groups = array(), $cap_id = '' ) {
		if ( in_array( $cap_id, self::get_capabilities(), true ) ) {
			$groups = (array) $groups;
			$groups[] = 'wordpress-seo';
		}
		return $groups;
	}
}
