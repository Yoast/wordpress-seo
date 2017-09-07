<?php
/**
 * @package WPSEO\Admin\Roles
 */

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
		$role_manager->register(
			'wpseo_manager',
			'SEO Manager',
			$this->combine_capabilities( 'editor', $capability_manager->get_capabilities(), true ),
			$this->combine_capabilities( 'editor', array(), false )
		);

		// Only add specific editor capabilities.
		$role_manager->register(
			'wpseo_editor',
			'SEO Editor',
			$this->combine_capabilities(
				'editor',
				array(
					'wpseo_bulk_edit',
					'wpseo_edit_advanced_metadata'
				), true
			),
			$this->combine_capabilities( 'editor', array(), false )
		);
	}

	/**
	 * Combines existing role capabilities with provided capabilities.
	 *
	 * @param string $role         Role to fetch capabilities of.
	 * @param array  $capabilities Capabilities to merge.
	 * @param bool   $enabled      Fetch granted or restricted capabilities.
	 *
	 * @return array
	 */
	protected function combine_capabilities( $role, array $capabilities, $enabled ) {
		$wp_role = get_role( $role );
		if ( ! $wp_role ) {
			return $capabilities;
		}

		$role_capabilities = $wp_role->capabilities;
		$filter_callback   = $enabled ? 'is_enabled' : 'is_disabled';

		$filtered_capabilities = array_filter( $role_capabilities, array( $this, $filter_callback ) );
		$filtered_capabilities = array_keys( $filtered_capabilities );

		return array_merge( $filtered_capabilities, $capabilities );
	}

	/**
	 * Return true if true.
	 *
	 * @param bool $test Value to test against.
	 *
	 * @return bool If test is true.
	 */
	protected function is_enabled( $test ) {
		return $test === true;
	}

	/**
	 * Returns true if false.
	 *
	 * @param bool $test Value to test against.
	 *
	 * @return bool If test is false.
	 */
	protected function is_disabled( $test ) {
		return $test === false;
	}
}
