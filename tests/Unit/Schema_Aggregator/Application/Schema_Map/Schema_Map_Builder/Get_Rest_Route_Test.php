<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;

use Brain\Monkey\Functions;
use Generator;

/**
 * Tests the Schema_Map_Builder get_rest_route method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder::get_rest_route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Rest_Route_Test extends Abstract_Schema_Map_Builder_Test {

	/**
	 * Tests get_rest_route returns the correct URL.
	 *
	 * @dataProvider rest_route_data_provider
	 *
	 * @param string $post_type      The post type.
	 * @param int    $page           The page number.
	 * @param string $expected_route The expected route passed to rest_url.
	 *
	 * @return void
	 */
	public function test_get_rest_route( string $post_type, int $page, string $expected_route ) {
		Functions\expect( 'rest_url' )
			->once()
			->with( $expected_route )
			->andReturnUsing(
				static function ( $route ) {
					return 'https://example.com/wp-json/' . $route;
				},
			);

		$result = $this->instance->get_rest_route( $post_type, $page );

		$this->assertSame( 'https://example.com/wp-json/' . $expected_route, $result );
	}

	/**
	 * Tests get_rest_route defaults to page 1 when no page is provided.
	 *
	 * @return void
	 */
	public function test_get_rest_route_defaults_to_page_one() {
		Functions\expect( 'rest_url' )
			->once()
			->with( 'yoast/v1/schema-aggregator/get-schema/post' )
			->andReturn( 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post' );

		$result = $this->instance->get_rest_route( 'post' );

		$this->assertSame( 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post', $result );
	}

	/**
	 * Data provider for the get_rest_route test.
	 *
	 * @return Generator
	 */
	public static function rest_route_data_provider() {
		yield 'Page 1 returns route without page parameter' => [
			'post_type'      => 'post',
			'page'           => 1,
			'expected_route' => 'yoast/v1/schema-aggregator/get-schema/post',
		];

		yield 'Page 2 returns route with page parameter' => [
			'post_type'      => 'post',
			'page'           => 2,
			'expected_route' => 'yoast/v1/schema-aggregator/get-schema/post/2',
		];

		yield 'Page 5 returns route with page parameter' => [
			'post_type'      => 'product',
			'page'           => 5,
			'expected_route' => 'yoast/v1/schema-aggregator/get-schema/product/5',
		];
	}
}
