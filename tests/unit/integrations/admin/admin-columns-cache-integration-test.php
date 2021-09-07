<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey\Functions;
use Mockery;
use WP_Post;
use WP_Query;
use Yoast\WP\SEO\Integrations\Admin\Admin_Columns_Cache_Integration;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Admin_Columns_Cache_Integration_Test.
 *
 * @group integrations
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Admin_Columns_Cache_Integration
 */
class Admin_Columns_Cache_Integration_Test extends TestCase {

	/**
	 * Holds the admin columns cache integration.
	 *
	 * @var Admin_Columns_Cache_Integration
	 */
	private $instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->instance             = new Admin_Columns_Cache_Integration( $this->indexable_repository );
	}

	/**
	 * Tests the fill_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::fill_cache
	 */
	public function test_fill_cache() {
		global $wp_query;

		$posts = [ Mockery::mock( WP_Post::class ) ];

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = $posts;

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( $posts, 'ID' )
			->andReturn( [ 1 ] );

		$results = [ (object) [ 'object_id' => 1 ] ];

		$this->indexable_repository->expects( 'find_by_multiple_ids_and_type' )->once()->with( [ 1 ], 'post', false )->andReturn( $results );

		$this->instance->fill_cache();
	}

	/**
	 * Tests the fill_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::fill_cache
	 */
	public function test_fill_cache_with_posts() {
		global $wp_query;

		$posts = [ Mockery::mock( WP_Post::class ) ];

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = $posts;

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( $posts, 'ID' )
			->andReturn( [ 1 ] );

		$results = [ (object) [ 'object_id' => 1 ] ];

		$this->indexable_repository->expects( 'find_by_multiple_ids_and_type' )->once()->with( [ 1 ], 'post', false )->andReturn( $results );

		$this->instance->fill_cache();
	}

	/**
	 * Tests the fill_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::fill_cache
	 */
	public function test_fill_cache_with_non_post_query() {
		global $wp_query;

		$posts = [];

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = $posts;

		$this->instance->fill_cache();
	}
}
