<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests that disabled variables cannot be updated.
	 *
	 * @group ms-required
	 * @covers WPSEO_Option::validate()
	 * @covers WPSEO_Option::prevent_disabled_options_update()
	 */
	public function test_prevent_disabled_options_update() {
		$option_vars = array(
			'enable_admin_bar_menu',
			'enable_cornerstone_content',
			'enable_xml_sitemap',
		);

		foreach ( $option_vars as $option_var ) {
			WPSEO_Options::save_option( 'wpseo', $option_var, true );
		}

		// Unhook filters so that we can get the actual unaltered option value.
		remove_all_filters( 'option_wpseo' );
		$options  = WPSEO_Options::get_option( 'wpseo' );
		$expected = array_fill_keys( $option_vars, true );
		$this->assertEqualSets( $expected, array_intersect_key( $options, $expected ) );

		foreach ( $option_vars as $option_var ) {
			// Ensure the variable is disabled via the network.
			WPSEO_Options::save_option( 'wpseo_ms', WPSEO_Option::ALLOW_KEY_PREFIX . $option_var, false );

			// This must not have any effect since the variable should be disabled.
			WPSEO_Options::save_option( 'wpseo', $option_var, false );
		}

		// Unhook filters so that we can get the actual unaltered option value.
		remove_all_filters( 'option_wpseo' );
		$options  = WPSEO_Options::get_option( 'wpseo' );
		$expected = array_fill_keys( $option_vars, true );
		$this->assertEqualSets( $expected, array_intersect_key( $options, $expected ) );
	}
}
