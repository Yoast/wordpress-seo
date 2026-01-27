<?php

namespace Yoast\WP\SEO\Tests\WP\Repositories;

use Generator;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Indexable_Repository.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Repository
 */
final class Indexable_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Indexable_Repository
	 */
	private $instance;

	/**
	 * Created indexable IDs for cleanup.
	 *
	 * @var array<int>
	 */
	private $created_indexables = [];

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		global $wpdb;

		// Clean up any existing indexables.
		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );

		$this->instance = \YoastSEO()->classes->get( Indexable_Repository::class );
		$this->create_test_indexables();
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		global $wpdb;

		// Clean up all indexables to ensure clean state.
		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );

		parent::tear_down();
	}

	/**
	 * Tests the find_all_public_paginated method with real database data.
	 *
	 * @dataProvider find_all_public_paginated_data
	 * @covers ::find_all_public_paginated
	 *
	 * @param int                   $page                The page number.
	 * @param int                   $page_size           The number of items per page.
	 * @param string                $post_type           The post type to filter by.
	 * @param int                   $expected_count      The expected number of results.
	 * @param array<string, string> $expected_properties Expected properties to check in results.
	 *
	 * @return void
	 */
	public function test_find_all_public_paginated( int $page, int $page_size, string $post_type, int $expected_count, array $expected_properties ): void {
		$result = $this->instance->find_all_public_paginated( $page, $page_size, $post_type );

		$this->assertIsArray( $result, 'Result should be an array' );
		$this->assertCount( $expected_count, $result, "Should return exactly {$expected_count} indexables. Got " . \count( $result ) . " results for post type {$post_type}" );

		if ( $expected_count > 0 ) {
			foreach ( $result as $index => $indexable ) {
				$this->assertNotFalse( $indexable, "Result at index {$index} should not be false" );

				if ( $indexable !== false ) {
					$this->assertInstanceOf( Indexable::class, $indexable, 'Each result should be an Indexable instance' );
					$this->assertEquals( $post_type, $indexable->object_sub_type, "Post type should be {$post_type}" );
					$this->assertEquals( 'publish', $indexable->post_status, 'Post status should be publish' );

					foreach ( $expected_properties as $property => $value ) {
						$this->assertEquals( $value, $indexable->$property, "Property {$property} should match expected value" );
					}
				}
			}
		}
	}

	/**
	 * Data provider for the find_all_public_paginated test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function find_all_public_paginated_data(): Generator {
		yield 'First page posts - should return 3 posts' => [
			'page'                => 1,
			'page_size'           => 5,
			'post_type'           => 'post',
			'expected_count'      => 3,
			'expected_properties' => [ 'object_type' => 'post' ],
		];

		yield 'Second page posts - should return 0 (only 3 exist)' => [
			'page'                => 2,
			'page_size'           => 5,
			'post_type'           => 'post',
			'expected_count'      => 0,
			'expected_properties' => [],
		];

		yield 'First page pages - should return 2 pages' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'page',
			'expected_count'      => 2,
			'expected_properties' => [ 'object_type' => 'post' ],
		];

		yield 'Small page size - should return 1 post' => [
			'page'                => 1,
			'page_size'           => 1,
			'post_type'           => 'post',
			'expected_count'      => 1,
			'expected_properties' => [ 'object_type' => 'post' ],
		];

		yield 'Third post with page size 1 - should return 1 post' => [
			'page'                => 3,
			'page_size'           => 1,
			'post_type'           => 'post',
			'expected_count'      => 1,
			'expected_properties' => [ 'object_type' => 'post' ],
		];

		yield 'Non-existent post type - should return 0' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'non_existent_type',
			'expected_count'      => 0,
			'expected_properties' => [],
		];
	}

	/**
	 * Creates test indexables in the database.
	 *
	 * @return void
	 */
	private function create_test_indexables(): void {
		global $wpdb;

		$indexables_data = [
			[
				'object_type'      => 'post',
				'object_sub_type'  => 'post',
				'post_status'      => 'publish',
				'is_public'        => 1,
				'permalink'        => 'https://example.com/post-1',
				'permalink_hash'   => \strlen( 'https://example.com/post-1' ) . ':' . \md5( 'https://example.com/post-1' ),
				'created_at'       => '2024-01-01 10:00:00',
				'updated_at'       => '2024-01-01 10:00:00',
				'blog_id'          => \get_current_blog_id(),
				'version'          => 2,
				'title'            => 'Post 1',
				'description'      => 'Description 1',
				'breadcrumb_title' => 'Post 1',
			],
			[
				'object_type'      => 'post',
				'object_sub_type'  => 'post',
				'post_status'      => 'publish',
				'is_public'        => null, // Null should be treated as public.
				'permalink'        => 'https://example.com/post-2',
				'permalink_hash'   => \strlen( 'https://example.com/post-2' ) . ':' . \md5( 'https://example.com/post-2' ),
				'created_at'       => '2024-01-02 10:00:00',
				'updated_at'       => '2024-01-02 10:00:00',
				'blog_id'          => \get_current_blog_id(),
				'version'          => 2,
				'title'            => 'Post 2',
				'description'      => 'Description 2',
				'breadcrumb_title' => 'Post 2',
			],
			[
				'object_type'      => 'post',
				'object_sub_type'  => 'post',
				'post_status'      => 'publish',
				'is_public'        => 1,
				'permalink'        => 'https://example.com/post-3',
				'permalink_hash'   => \strlen( 'https://example.com/post-3' ) . ':' . \md5( 'https://example.com/post-3' ),
				'created_at'       => '2024-01-03 10:00:00',
				'updated_at'       => '2024-01-03 10:00:00',
				'blog_id'          => \get_current_blog_id(),
				'version'          => 2,
				'title'            => 'Post 3',
				'description'      => 'Description 3',
				'breadcrumb_title' => 'Post 3',
			],
			[
				'object_type'      => 'post',
				'object_sub_type'  => 'page',
				'post_status'      => 'publish',
				'is_public'        => 1,
				'permalink'        => 'https://example.com/page-1',
				'permalink_hash'   => \strlen( 'https://example.com/page-1' ) . ':' . \md5( 'https://example.com/page-1' ),
				'created_at'       => '2024-01-04 10:00:00',
				'updated_at'       => '2024-01-04 10:00:00',
				'blog_id'          => \get_current_blog_id(),
				'version'          => 2,
				'title'            => 'Page 1',
				'description'      => 'Description 1',
				'breadcrumb_title' => 'Page 1',
			],
			[
				'object_type'      => 'post',
				'object_sub_type'  => 'page',
				'post_status'      => 'publish',
				'is_public'        => 1,
				'permalink'        => 'https://example.com/page-2',
				'permalink_hash'   => \strlen( 'https://example.com/page-2' ) . ':' . \md5( 'https://example.com/page-2' ),
				'created_at'       => '2024-01-05 10:00:00',
				'updated_at'       => '2024-01-05 10:00:00',
				'blog_id'          => \get_current_blog_id(),
				'version'          => 2,
				'title'            => 'Page 2',
				'description'      => 'Description 2',
				'breadcrumb_title' => 'Page 2',
			],
		];

		foreach ( $indexables_data as $data ) {
			$wpdb->insert( $wpdb->prefix . 'yoast_indexable', $data );
			$this->created_indexables[] = $wpdb->insert_id;
		}
	}
}
