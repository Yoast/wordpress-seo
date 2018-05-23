<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Capabilities
 */

/**
 * Unit Test Class.
 */
class WPSEO_Register_Capabilities_Tests extends WPSEO_UnitTestCase {

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
	 * @covers WPSEO_Register_Capabilities::filter_user_has_wpseo_manage_options_cap()
	 *
	 * @param string $role             Which role to test. 'network_administrator' is also allowed.
	 * @param string $access           Access setting value to test. Either 'admin' or 'superadmin'.
	 * @param bool   $expected_has_cap Whether the expected capability check result is true or false.
	 */
	public function test_filter_user_has_wpseo_manage_options_cap( $role, $access, $expected_has_cap ) {
		WPSEO_Options::get_instance();

		$options           = get_site_option( 'wpseo_ms', array() );
		$options['access'] = $access;
		update_site_option( 'wpseo_ms', $options );

		$register = new WPSEO_Register_Capabilities();
		$register->register();

		if ( $role === 'network_administrator' ) {
			$user = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
			grant_super_admin( $user->ID );
		}
		else {
			$user = self::factory()->user->create_and_get( array( 'role' => $role ) );
		}

		$allcaps = $register->filter_user_has_wpseo_manage_options_cap( $user->allcaps, array( 'wpseo_manage_options' ), array(), $user );

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
		return array(
			array( 'wpseo_manager', 'superadmin', true ),
			array( 'administrator', 'superadmin', false ),
			array( 'network_administrator', 'superadmin', true ),
			array( 'wpseo_manager', 'admin', true ),
			array( 'administrator', 'admin', true ),
			array( 'network_administrator', 'admin', true ),
		);
	}
}
