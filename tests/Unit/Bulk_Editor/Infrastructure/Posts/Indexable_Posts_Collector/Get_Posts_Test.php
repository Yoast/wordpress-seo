<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Tests get_posts.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::get_posts
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::build_query
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::resolve_total
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::apply_search
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::build_post
 */
final class Get_Posts_Test extends Abstract_Indexable_Posts_Collector_Test {

	/**
	 * The statuses passed in the query.
	 *
	 * @var array<string>
	 */
	private const STATUSES = [ 'publish', 'draft', 'pending', 'future' ];

	/**
	 * Tests that a partially-filled page is mapped to posts and its total is derived without a count query.
	 *
	 * @return void
	 */
	public function test_get_posts() {
		$indexable                         = new Indexable_Mock();
		$indexable->object_id              = 7;
		$indexable->post_status            = 'draft';
		$indexable->primary_focus_keyword  = 'hello';
		$indexable->title                  = 'Hello | Site';
		$indexable->description            = 'A description.';
		$indexable->open_graph_title       = 'Social hello';
		$indexable->open_graph_description = 'Social description.';

		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->with( 'object_type', 'post' )->andReturnSelf();
		$query->allows( 'where' )->with( 'object_sub_type', 'page' )->andReturnSelf();
		$query->allows( 'where_in' )->with( 'post_status', self::STATUSES )->andReturnSelf();
		$query->allows( 'order_by_desc' )->with( 'object_id' )->andReturnSelf();
		$query->allows( 'limit' )->with( 20 )->andReturnSelf();
		$query->allows( 'offset' )->with( 0 )->andReturnSelf();
		$query->expects( 'find_many' )->once()->andReturn( [ $indexable ] );
		// The page is not full, so the total is offset + rows and no count query runs.
		$query->expects( 'count' )->never();

		$this->indexable_repository->expects( 'query' )->once()->andReturn( $query );

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );

		$this->assertSame(
			[
				'posts'       => [
					[
						'id'                 => 7,
						'title'              => 'Hello world',
						'status'             => 'draft',
						'edit_link'          => 'post.php?post=7&action=edit',
						'focus_keyphrase'    => 'hello',
						'seo_title'          => 'Hello | Site',
						'meta_description'   => 'A description.',
						'social_title'       => 'Social hello',
						'social_description' => 'Social description.',
					],
				],
				'total'       => 1,
				'total_pages' => 1,
				'page'        => 1,
				'per_page'    => 20,
			],
			$this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array(),
		);
	}

	/**
	 * Tests that a full page runs a count query for the exact total.
	 *
	 * @return void
	 */
	public function test_get_posts_counts_when_page_is_full() {
		$indexable            = new Indexable_Mock();
		$indexable->object_id = 7;

		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->andReturnSelf();
		$query->allows( 'where_in' )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->with( 1 )->andReturnSelf();
		$query->allows( 'offset' )->andReturnSelf();
		// The page is full (rows == per_page), so the total is not yet known and a count query runs.
		$query->expects( 'find_many' )->once()->andReturn( [ $indexable ] );
		$query->expects( 'count' )->once()->andReturn( 50 );

		$this->indexable_repository->expects( 'query' )->twice()->andReturn( $query );

		Functions\expect( 'get_the_title' )->once()->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->andReturn( 'edit' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 1, '', self::STATUSES ) )->to_array();

		$this->assertSame( 50, $result['total'] );
		$this->assertSame( 50, $result['total_pages'] );
	}

	/**
	 * Tests that an empty page applies the offset and falls back to a count query for the total.
	 *
	 * @return void
	 */
	public function test_get_posts_counts_when_page_is_empty() {
		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->andReturnSelf();
		$query->allows( 'where_in' )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->with( 20 )->andReturnSelf();
		$query->expects( 'offset' )->once()->with( 40 )->andReturnSelf();
		$query->expects( 'count' )->once()->andReturn( 100 );
		$query->expects( 'find_many' )->once()->andReturn( [] );

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 3, 20, '', self::STATUSES ) )->to_array();

		$this->assertSame( 100, $result['total'] );
		$this->assertSame( 5, $result['total_pages'] );
		$this->assertSame( 3, $result['page'] );
	}

	/**
	 * Tests that a search term adds the catch-all clause to both the count and the page query.
	 *
	 * @return void
	 */
	public function test_get_posts_with_search() {
		global $wpdb;
		$wpdb        = Mockery::mock();
		$wpdb->posts = 'wp_posts';
		$wpdb->expects( 'esc_like' )->twice()->with( 'seo' )->andReturn( 'seo' );

		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->andReturnSelf();
		$query->allows( 'where_in' )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->andReturnSelf();
		$query->allows( 'offset' )->andReturnSelf();
		$query->expects( 'where_raw' )->twice()->andReturnSelf();
		$query->allows( 'count' )->andReturn( 0 );
		$query->expects( 'find_many' )->once()->andReturn( [] );

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, 'seo', self::STATUSES ) )->to_array();

		$this->assertSame( [], $result['posts'] );
		$this->assertSame( 0, $result['total'] );
		$this->assertSame( 0, $result['total_pages'] );
	}
}
