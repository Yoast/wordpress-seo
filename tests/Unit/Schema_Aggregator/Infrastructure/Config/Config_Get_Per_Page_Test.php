<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Config;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the get_per_page method.
 *
 * @group Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config::get_per_page
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Config_Get_Per_Page_Test extends Abstract_Config_Test {

	/**
	 * Tests getting per page count based on post type.
	 *
	 * @dataProvider get_per_page_data
	 *
	 * @param string $post_type                    The post type to check.
	 * @param mixed  $big_schema_post_types_filter The value returned by the big schema filter.
	 * @param int    $per_page_big_filter          The value returned by the per page big filter.
	 * @param int    $per_page_default_filter      The value returned by the per page default filter.
	 * @param int    $expected                     The expected result.
	 *
	 * @return void
	 */
	public function test_get_per_page( $post_type, $big_schema_post_types_filter, $per_page_big_filter, $per_page_default_filter, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_schema_aggregator_big_schema_post_types', [ 'product' ] )
			->andReturn( $big_schema_post_types_filter );

		$big_schema_list = \is_array( $big_schema_post_types_filter ) ? $big_schema_post_types_filter : [ 'product' ];
		$is_big_schema   = \in_array( $post_type, $big_schema_list, true );

		if ( $is_big_schema ) {
			Functions\expect( 'apply_filters' )
				->once()
				->with( 'wpseo_schema_aggregator_per_page_big', 100 )
				->andReturn( $per_page_big_filter );
		}
		else {
			Functions\expect( 'apply_filters' )
				->once()
				->with( 'wpseo_schema_aggregator_per_page', 1000 )
				->andReturn( $per_page_default_filter );
		}

		$this->assertEquals( $expected, $this->instance->get_per_page( $post_type ) );
	}

	/**
	 * Data provider for the get_per_page test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_per_page_data() {
		yield 'Product post type with default big schema list - returns big per page' => [
			'post_type'                    => 'product',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1000,
			'expected'                     => 100,
		];

		yield 'Post type with default settings - returns default per page' => [
			'post_type'                    => 'post',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1000,
			'expected'                     => 1000,
		];

		yield 'Page post type - returns default per page' => [
			'post_type'                    => 'page',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1000,
			'expected'                     => 1000,
		];

		yield 'Custom post type added to big schema list via filter' => [
			'post_type'                    => 'event',
			'big_schema_post_types_filter' => [ 'product', 'event' ],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1000,
			'expected'                     => 100,
		];

		yield 'Big schema filter returns non-array - falls back to default list' => [
			'post_type'                    => 'product',
			'big_schema_post_types_filter' => 'invalid',
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1000,
			'expected'                     => 100,
		];

		yield 'Big schema filter returns empty array - no big schema types' => [
			'post_type'                    => 'product',
			'big_schema_post_types_filter' => [],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1000,
			'expected'                     => 1000,
		];

		yield 'Per page exceeds max - capped at max' => [
			'post_type'                    => 'post',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 1500,
			'expected'                     => 1000,
		];

		yield 'Big per page exceeds max - capped at max' => [
			'post_type'                    => 'product',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 2000,
			'per_page_default_filter'      => 1000,
			'expected'                     => 1000,
		];

		yield 'Custom per page values within limits' => [
			'post_type'                    => 'post',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 100,
			'per_page_default_filter'      => 500,
			'expected'                     => 500,
		];

		yield 'Big per page custom value within limits' => [
			'post_type'                    => 'product',
			'big_schema_post_types_filter' => [ 'product' ],
			'per_page_big_filter'          => 50,
			'per_page_default_filter'      => 1000,
			'expected'                     => 50,
		];
	}
}
