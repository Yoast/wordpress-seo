<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Capabilities
 */

/**
 * Unit Test Class.
 */
class WPSEO_Register_Capabilities_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether the list of registered capabilities contains the correct capabilities.
	 *
	 * @covers WPSEO_Register_Capabilities::register
	 */
	public function test_register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$register = new WPSEO_Register_Capabilities();
		$register->register();

		$registered = $manager->get_capabilities();

		$this->assertContains( 'wpseo_bulk_edit', $registered );
		$this->assertContains( 'wpseo_edit_advanced_metadata', $registered );
		$this->assertContains( 'wpseo_manage_options', $registered );
	}

	/**
	 * Tests that capabilities are correctly unset if only super admins have access.
	 *
	 * @group ms-required
	 *
	 * @dataProvider data_filter_user_has_wpseo_manage_options_cap
	 *
	 * @covers WPSEO_Register_Capabilities::filter_user_has_wpseo_manage_options_cap
	 *
	 * @param string $role             Which role to test. 'network_administrator' is also allowed.
	 * @param string $access           Access setting value to test. Either 'admin' or 'superadmin'.
	 * @param bool   $expected_has_cap Whether the expected capability check result is true or false.
	 */
	public function test_filter_user_has_wpseo_manage_options_cap( $role, $access, $expected_has_cap ) {
		$this->skipWithoutMultisite();

		WPSEO_Options::get_instance();

		$options           = get_site_option( 'wpseo_ms', [] );
		$options['access'] = $access;
		update_site_option( 'wpseo_ms', $options );

		WPSEO_Options::clear_cache();

		$register = new WPSEO_Register_Capabilities();
		$register->register();

		if ( $role === 'network_administrator' ) {
			$user = self::factory()->user->create_and_get( [ 'role' => 'administrator' ] );
			grant_super_admin( $user->ID );
		}
		else {
			$user = self::factory()->user->create_and_get( [ 'role' => $role ] );
		}

		$allcaps = $register->filter_user_has_wpseo_manage_options_cap( $user->allcaps, [ 'wpseo_manage_options' ], [], $user );

		$this->assertSame( $expected_has_cap, ! empty( $allcaps['wpseo_manage_options'] ) );
	}

	/**
	 * Provides test data for the `test_filter_user_has_wpseo_manage_options_cap()` test.
	 *
	 * The format for each record is:
	 * [0] string: The role to test.
	 * [1] string: The access setting value to test.
	 * [2] bool:   The expected test result.
	 *
	 * @return array The test data.
	 */
	public function data_filter_user_has_wpseo_manage_options_cap() {
		return [
			[ 'wpseo_manager', 'superadmin', true ],
			[ 'administrator', 'superadmin', false ],
			[ 'network_administrator', 'superadmin', true ],
			[ 'wpseo_manager', 'admin', true ],
			[ 'administrator', 'admin', true ],
			[ 'network_administrator', 'admin', true ],
		];
	}
}
