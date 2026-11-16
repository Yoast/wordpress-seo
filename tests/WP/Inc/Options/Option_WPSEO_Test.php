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
	 * @var array<string>
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

	/**
	 * Tests the validation of the timestamp options.
	 *
	 * @dataProvider provider_validate_timestamps
	 * @covers WPSEO_Option_Wpseo::validate_option
	 *
	 * @param string          $key      The option key.
	 * @param bool            $posted   Whether the key is part of the posted values.
	 * @param string|int|null $dirty    The posted value.
	 * @param string|int|null $old      The stored value.
	 * @param int|null        $expected The expected validated value.
	 *
	 * @return void
	 */
	public function test_validate_timestamps( $key, $posted, $dirty, $old, $expected ) {
		global $wpdb;

		$wpdb->update(
			$wpdb->options,
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- Reason: There's no security risk, because users don't interact with tests.
			[ 'option_value' => \serialize( \array_merge( \get_option( 'wpseo' ), [ $key => $old ] ) ) ],
			[ 'option_name' => 'wpseo' ],
		);
		\wp_cache_delete( 'wpseo', 'options' );
		\wp_cache_delete( 'alloptions', 'options' );
		WPSEO_Options::clear_cache();

		$option_instance = WPSEO_Options::get_option_instance( 'wpseo' );
		$posted_values   = [ 'enable_schema_aggregation_endpoint' => true ];
		if ( $posted ) {
			$posted_values[ $key ] = $dirty;
		}

		$clean = $option_instance->validate( $posted_values );

		$this->assertSame( $expected, $clean[ $key ] );
	}

	/**
	 * Data provider for test_validate_timestamps.
	 *
	 * @return array<string, array<string, bool|string|int|null>>
	 */
	public static function provider_validate_timestamps() {
		return [
			'posted timestamp is stored as an integer'    => [
				'key'      => 'schema_aggregation_endpoint_enabled_on',
				'posted'   => true,
				'dirty'    => '1700000000',
				'old'      => null,
				'expected' => 1_700_000_000,
			],
			'posted text null is dropped'                 => [
				'key'      => 'schema_aggregation_endpoint_enabled_on',
				'posted'   => true,
				'dirty'    => 'null',
				'old'      => null,
				'expected' => null,
			],
			'missing key keeps the stored timestamp'      => [
				'key'      => 'schema_aggregation_endpoint_enabled_on',
				'posted'   => false,
				'dirty'    => null,
				'old'      => 1_700_000_000,
				'expected' => 1_700_000_000,
			],
			'missing key drops the stored text null'      => [
				'key'      => 'schema_aggregation_endpoint_enabled_on',
				'posted'   => false,
				'dirty'    => null,
				'old'      => 'null',
				'expected' => null,
			],
			'missing key keeps the free sparks timestamp' => [
				'key'      => 'ai_free_sparks_started_on',
				'posted'   => false,
				'dirty'    => null,
				'old'      => 1_600_000_000,
				'expected' => 1_600_000_000,
			],
			'missing key drops the free sparks text null' => [
				'key'      => 'ai_free_sparks_started_on',
				'posted'   => false,
				'dirty'    => null,
				'old'      => 'null',
				'expected' => null,
			],
		];
	}
}
