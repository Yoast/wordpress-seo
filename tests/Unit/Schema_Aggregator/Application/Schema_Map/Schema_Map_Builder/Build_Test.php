<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;

use Brain\Monkey\Functions;
use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;

/**
 * Tests the Schema_Map_Builder build method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder::build
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Build_Test extends Abstract_Schema_Map_Builder_Test {

	/**
	 * Tests building the schema map with various post type and count combinations.
	 *
	 * @dataProvider build_data_provider
	 *
	 * @param array<array<string,mixed>> $indexable_counts_data The indexable counts data (post_type => count).
	 * @param int                        $per_page              The per page threshold.
	 * @param array<array<string,mixed>> $expected_map          The expected schema map output.
	 *
	 * @return void
	 */
	public function test_build( array $indexable_counts_data, int $per_page, array $expected_map ) {
		$collection = new Indexable_Count_Collection();
		foreach ( $indexable_counts_data as $data ) {
			$collection->add_indexable_count( new Indexable_Count( $data['post_type'], $data['count'] ) );
		}

		foreach ( $indexable_counts_data as $data ) {
			$this->config
				->expects( 'get_per_page' )
				->with( $data['post_type'] )
				->andReturn( $per_page );
		}

		$this->schema_map_repository
			->allows( 'get_lastmod_for_post_type' )
			->andReturn( '2025-01-01T00:00:00Z' );

		Functions\expect( 'rest_url' )
			->andReturnUsing(
				static function ( $route ) {
					return 'https://example.com/wp-json/' . $route;
				}
			);

		$result = $this->instance->build( $collection );

		$this->assertSame( \count( $expected_map ), \count( $result ) );

		foreach ( $expected_map as $index => $expected_entry ) {
			$this->assertSame( $expected_entry['post_type'], $result[ $index ]['post_type'] );
			$this->assertSame( $expected_entry['count'], $result[ $index ]['count'] );
			$this->assertStringContainsString( $expected_entry['url_contains'], $result[ $index ]['url'] );
			$this->assertSame( '2025-01-01T00:00:00Z', $result[ $index ]['lastmod'] );
		}
	}

	/**
	 * Tests building the schema map with an empty collection.
	 *
	 * @return void
	 */
	public function test_build_with_empty_collection() {
		$collection = new Indexable_Count_Collection();

		$result = $this->instance->build( $collection );

		$this->assertSame( [], $result );
	}

	/**
	 * Data provider for the build test.
	 *
	 * @return Generator
	 */
	public static function build_data_provider() {
		yield 'Single post type, single page' => [
			'indexable_counts_data' => [
				[
					'post_type' => 'post',
					'count'     => 50,
				],
			],
			'per_page'              => 100,
			'expected_map'          => [
				[
					'post_type'    => 'post',
					'count'        => 50,
					'url_contains' => 'get-schema/post',
				],
			],
		];

		yield 'Single post type, multiple pages' => [
			'indexable_counts_data' => [
				[
					'post_type' => 'post',
					'count'     => 250,
				],
			],
			'per_page'              => 100,
			'expected_map'          => [
				[
					'post_type'    => 'post',
					'count'        => 100,
					'url_contains' => 'get-schema/post',
				],
				[
					'post_type'    => 'post',
					'count'        => 100,
					'url_contains' => 'get-schema/post/2',
				],
				[
					'post_type'    => 'post',
					'count'        => 50,
					'url_contains' => 'get-schema/post/3',
				],
			],
		];

		yield 'Multiple post types' => [
			'indexable_counts_data' => [
				[
					'post_type' => 'post',
					'count'     => 50,
				],
				[
					'post_type' => 'page',
					'count'     => 30,
				],
			],
			'per_page'              => 100,
			'expected_map'          => [
				[
					'post_type'    => 'post',
					'count'        => 50,
					'url_contains' => 'get-schema/post',
				],
				[
					'post_type'    => 'page',
					'count'        => 30,
					'url_contains' => 'get-schema/page',
				],
			],
		];

		yield 'Last page has correct remainder count' => [
			'indexable_counts_data' => [
				[
					'post_type' => 'product',
					'count'     => 350,
				],
			],
			'per_page'              => 100,
			'expected_map'          => [
				[
					'post_type'    => 'product',
					'count'        => 100,
					'url_contains' => 'get-schema/product',
				],
				[
					'post_type'    => 'product',
					'count'        => 100,
					'url_contains' => 'get-schema/product/2',
				],
				[
					'post_type'    => 'product',
					'count'        => 100,
					'url_contains' => 'get-schema/product/3',
				],
				[
					'post_type'    => 'product',
					'count'        => 50,
					'url_contains' => 'get-schema/product/4',
				],
			],
		];
	}
}
