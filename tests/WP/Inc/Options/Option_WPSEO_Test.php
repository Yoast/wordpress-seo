<?php

namespace Yoast\WP\SEO\Tests\WP\Inc\Options;

use WPSEO_Option;
use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Option_WPSEO_Test extends TestCase {

	/**
	 * Features which can be disabled via the network settings.
	 *
	 * @var array
	 */
	protected $feature_vars = [
		'disableadvanced_meta',
		'ryte_indexability',
		'content_analysis_active',
		'keyword_analysis_active',
		'enable_admin_bar_menu',
		'enable_cornerstone_content',
		'enable_xml_sitemap',
		'enable_text_link_counter',
		'semrush_integration_active',
	];

	/**
	 * Tests that disabled 'wpseo' feature variables return false.
	 *
	 * @group  ms-required
	 * @covers WPSEO_Option::validate
	 * @covers WPSEO_Option::prevent_disabled_options_update
	 *
	 * @return void
	 */
	public function test_verify_features_against_network() {
		$this->skipWithoutMultisite();

		$options                       = WPSEO_Options::get_option( 'wpseo' );
		$expected                      = \array_fill_keys( $this->feature_vars, true );
		$expected['ryte_indexability'] = false;
		$this->assertEqualSets( $expected, \array_intersect_key( $options, $expected ) );

		// Ensure the variables are disabled via the network.
		foreach ( $this->feature_vars as $feature_var ) {
			WPSEO_Options::save_option( 'wpseo_ms', WPSEO_Option::ALLOW_KEY_PREFIX . $feature_var, false );
		}

		// Test method directly.
		$options  = WPSEO_Options::get_option_instance( 'wpseo' )->verify_features_against_network( $options );
		$expected = \array_fill_keys( $this->feature_vars, false );
		$this->assertEqualSets( $expected, \array_intersect_key( $options, $expected ) );

		// Test method integration with filters.
		$options  = WPSEO_Options::get_option( 'wpseo' );
		$expected = \array_fill_keys( $this->feature_vars, false );
		$this->assertEqualSets( $expected, \array_intersect_key( $options, $expected ) );
	}
}
