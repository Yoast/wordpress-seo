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
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::resolve_total
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::build_query
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
	 * Tests that an editable post is returned with its SEO data, and a partial page derives the total
	 * without a count query.
	 *
	 * @return void
	 */
	public function test_get_posts_editable() {
		$indexable                         = new Indexable_Mock();
		$indexable->object_id              = 7;
		$indexable->post_status            = 'draft';
		$indexable->primary_focus_keyword  = 'hello';
		$indexable->title                  = 'Hello | Site';
		$indexable->description            = 'A description.';
		$indexable->open_graph_title       = 'Social hello';
		$indexable->open_graph_description = 'Social description.';

		$query = $this->stub_page_query( [ $indexable ] );
		// The page is not full, so the total is derived and no count query runs.
		$query->expects( 'count' )->never();

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

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
						'editable'           => true,
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
	 * Tests that a non-editable post is returned locked and without its SEO data.
	 *
	 * @return void
	 */
	public function test_get_posts_locks_non_editable_post() {
		$indexable                        = new Indexable_Mock();
		$indexable->object_id             = 7;
		$indexable->post_status           = 'publish';
		$indexable->primary_focus_keyword = 'secret';
		$indexable->title                 = 'Secret | Site';

		$query = $this->stub_page_query( [ $indexable ] );
		$query->allows( 'count' );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => false ] );

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Secret post' );
		// A locked post exposes neither its edit link nor its SEO data.
		Functions\expect( 'get_edit_post_link' )->never();

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array();

		$this->assertSame(
			[
				'id'                 => 7,
				'title'              => 'Secret post',
				'status'             => 'publish',
				'edit_link'          => '',
				'focus_keyphrase'    => '',
				'seo_title'          => '',
				'meta_description'   => '',
				'social_title'       => '',
				'social_description' => '',
				'editable'           => false,
			],
			$result['posts'][0],
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

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

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
		$query->expects( 'offset' )->with( 40 )->andReturnSelf();
		$query->expects( 'count' )->once()->andReturn( 100 );
		$query->expects( 'find_many' )->once()->andReturn( [] );

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		$this->post_editability_resolver->expects( 'resolve' )->with( [] )->andReturn( [] );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 3, 20, '', self::STATUSES ) )->to_array();

		$this->assertSame( 100, $result['total'] );
		$this->assertSame( 5, $result['total_pages'] );
		$this->assertSame( 3, $result['page'] );
	}

	/**
	 * Tests that duplicate indexable rows for the same post yield a single post and an accurate total.
	 *
	 * @return void
	 */
	public function test_get_posts_deduplicates_indexables() {
		$indexable            = new Indexable_Mock();
		$indexable->object_id = 7;

		$duplicate            = new Indexable_Mock();
		$duplicate->object_id = 7;

		$query = $this->stub_page_query( [ $indexable, $duplicate ] );
		// The page ended within the fetched rows, so the total comes from the distinct count, not a count query.
		$query->expects( 'count' )->never();

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'edit' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array();

		$this->assertCount( 1, $result['posts'] );
		$this->assertSame( 7, $result['posts'][0]['id'] );
		$this->assertSame( 1, $result['total'] );
	}

	/**
	 * Tests that a search term adds the catch-all clause and an empty result yields an empty page.
	 *
	 * @return void
	 */
	public function test_get_posts_with_search() {
		global $wpdb;
		$wpdb        = Mockery::mock();
		$wpdb->posts = 'wp_posts';
		// build_query runs twice (the page query and the count query), so the search clause is built twice.
		$wpdb->expects( 'esc_like' )->twice()->with( 'seo' )->andReturn( 'seo' );

		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->andReturnSelf();
		$query->allows( 'where_in' )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->andReturnSelf();
		$query->allows( 'offset' )->andReturnSelf();
		$query->expects( 'where_raw' )->twice()->andReturnSelf();
		$query->expects( 'find_many' )->once()->andReturn( [] );
		$query->expects( 'count' )->once()->andReturn( 0 );

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		$this->post_editability_resolver->expects( 'resolve' )->with( [] )->andReturn( [] );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, 'seo', self::STATUSES ) )->to_array();

		$this->assertSame( [], $result['posts'] );
		$this->assertSame( 0, $result['total'] );
	}

	/**
	 * Tests that a post ID restriction narrows the query to those posts.
	 *
	 * @return void
	 */
	public function test_get_posts_restricts_to_the_included_post_ids() {
		$indexable            = new Indexable_Mock();
		$indexable->object_id = 5;

		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->andReturnSelf();
		$query->expects( 'where_in' )->with( 'post_status', self::STATUSES )->andReturnSelf();
		$query->expects( 'where_in' )->with( 'object_id', [ 5, 3 ] )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->andReturnSelf();
		$query->allows( 'offset' )->andReturnSelf();
		// The page is not full, so the total is derived and build_query runs only once.
		$query->expects( 'find_many' )->once()->andReturn( [ $indexable ] );
		$query->expects( 'count' )->never();

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 5 ] )->andReturn( [ 5 => true ] );

		Functions\expect( 'get_the_title' )->once()->with( 5 )->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 5, 'raw' )->andReturn( 'edit' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES, null, [ 5, 3 ] ) )->to_array();

		$this->assertSame( 5, $result['posts'][0]['id'] );
		$this->assertSame( 1, $result['total'] );
	}

	/**
	 * Stubs the indexable query for a page that returns the given rows, without constraining count().
	 *
	 * @param array<Indexable_Mock> $rows The indexables the page query returns.
	 *
	 * @return Mockery\MockInterface|ORM The query mock, so the caller can add a count() expectation.
	 */
	private function stub_page_query( array $rows ) {
		$query = Mockery::mock( ORM::class );
		$query->allows( 'where' )->andReturnSelf();
		$query->allows( 'where_in' )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->andReturnSelf();
		$query->allows( 'offset' )->andReturnSelf();
		$query->expects( 'find_many' )->once()->andReturn( $rows );

		$this->indexable_repository->allows( 'query' )->andReturn( $query );

		return $query;
	}
}
