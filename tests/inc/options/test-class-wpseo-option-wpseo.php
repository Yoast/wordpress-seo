<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_WPSEO_Test extends WPSEO_UnitTestCase {

	protected $feature_vars = array(
		'disableadvanced_meta',
		'onpage_indexability',
		'content_analysis_active',
		'keyword_analysis_active',
		'enable_admin_bar_menu',
		'enable_cornerstone_content',
		'enable_xml_sitemap',
		'enable_text_link_counter',
	);

	/**
	 * Tests that disabled 'wpseo' feature variables return false.
	 *
	 * @group ms-required
	 * @covers WPSEO_Option::validate()
	 * @covers WPSEO_Option::prevent_disabled_options_update()
	 */
	public function test_verify_features_against_network() {
		$options  = WPSEO_Options::get_option( 'wpseo' );
		$expected = array_fill_keys( $this->feature_vars, true );
		$this->assertEqualSets( $expected, array_intersect_key( $options, $expected ) );

		// Ensure the variables are disabled via the network.
		foreach ( $this->feature_vars as $feature_var ) {
			WPSEO_Options::save_option( 'wpseo_ms', 'allow_' . $feature_var, false );
		}

		// Test method directly.
		$options  = WPSEO_Options::get_option_instance( 'wpseo' )->verify_features_against_network( $options );
		$expected = array_fill_keys( $this->feature_vars, false );
		$this->assertEqualSets( $expected, array_intersect_key( $options, $expected ) );

		// Test method integration with filters.
		$options  = WPSEO_Options::get_option( 'wpseo' );
		$expected = array_fill_keys( $this->feature_vars, false );
		$this->assertEqualSets( $expected, array_intersect_key( $options, $expected ) );
	}
}
