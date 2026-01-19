<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Aggregator_Config;

use Brain\Monkey\Functions;
use Generator;
use stdClass;

/**
 * Test class for the get_allowed_post_types method.
 *
 * @group schema-aggregator
 * @group Aggregator_Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config::get_allowed_post_types
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Aggregator_Config_Get_Allowed_Post_Types_Test extends Abstract_Aggregator_Config_Test {

	/**
	 * Tests getting allowed post types.
	 *
	 * @dataProvider get_allowed_post_types_data
	 *
	 * @param array<string> $default_post_types The default post types from the helper.
	 * @param mixed         $filtered_value     The value returned by the filter.
	 * @param array<string> $expected           The expected result.
	 *
	 * @return void
	 */
	public function test_get_allowed_post_types( $default_post_types, $filtered_value, $expected ) {
		$this->post_type_helper
			->expects( 'get_indexable_post_types' )
			->once()
			->andReturn( $default_post_types );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_schema_aggregator_post_types', $default_post_types )
			->andReturn( $filtered_value );

		$this->assertEquals( $expected, $this->instance->get_allowed_post_types() );
	}

	/**
	 * Data provider for the get_allowed_post_types test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_allowed_post_types_data() {
		yield 'Filter returns valid array - uses filtered value' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => [ 'post', 'page', 'custom' ],
			'expected'           => [ 'post', 'page', 'custom' ],
		];

		yield 'Filter returns same as default - uses default value' => [
			'default_post_types' => [ 'post', 'page', 'product' ],
			'filtered_value'     => [ 'post', 'page', 'product' ],
			'expected'           => [ 'post', 'page', 'product' ],
		];

		yield 'Filter returns empty array - uses empty array' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => [],
			'expected'           => [],
		];

		yield 'Filter returns string - falls back to default' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => 'invalid_string',
			'expected'           => [ 'post', 'page' ],
		];

		yield 'Filter returns null - falls back to default' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => null,
			'expected'           => [ 'post', 'page' ],
		];

		yield 'Filter returns integer - falls back to default' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => 123,
			'expected'           => [ 'post', 'page' ],
		];

		yield 'Filter returns boolean false - falls back to default' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => false,
			'expected'           => [ 'post', 'page' ],
		];

		yield 'Filter returns object - falls back to default' => [
			'default_post_types' => [ 'post', 'page' ],
			'filtered_value'     => new stdClass(),
			'expected'           => [ 'post', 'page' ],
		];

		yield 'Single post type from helper' => [
			'default_post_types' => [ 'post' ],
			'filtered_value'     => [ 'post' ],
			'expected'           => [ 'post' ],
		];

		yield 'Many post types including custom' => [
			'default_post_types' => [ 'post', 'page', 'product', 'event', 'recipe' ],
			'filtered_value'     => [ 'post', 'page', 'product', 'event', 'recipe', 'custom_type' ],
			'expected'           => [ 'post', 'page', 'product', 'event', 'recipe', 'custom_type' ],
		];
	}
}
