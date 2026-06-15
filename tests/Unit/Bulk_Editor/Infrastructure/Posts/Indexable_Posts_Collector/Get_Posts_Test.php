<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Tests get_posts.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::get_posts
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector::build_post
 */
final class Get_Posts_Test extends Abstract_Indexable_Posts_Collector_Test {

	/**
	 * Tests that the indexables are queried and mapped to posts.
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

		$query = Mockery::mock();
		$query->expects( 'where' )->once()->with( 'object_type', 'post' )->andReturnSelf();
		$query->expects( 'where' )->once()->with( 'object_sub_type', 'page' )->andReturnSelf();
		$query->expects( 'where_in' )->once()->with( 'post_status', [ 'publish', 'draft', 'pending', 'future' ] )->andReturnSelf();
		$query->expects( 'order_by_desc' )->once()->with( 'object_id' )->andReturnSelf();
		$query->expects( 'limit' )->once()->with( 20 )->andReturnSelf();
		$query->expects( 'find_many' )->once()->andReturn( [ $indexable ] );

		$this->indexable_repository->expects( 'query' )->once()->andReturn( $query );

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );

		$this->assertSame(
			[
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
			$this->instance->get_posts( 'page', 20 )->to_array(),
		);
	}

	/**
	 * Tests that an empty result set yields an empty list.
	 *
	 * @return void
	 */
	public function test_get_posts_empty() {
		$query = Mockery::mock();
		$query->allows( 'where' )->andReturnSelf();
		$query->allows( 'where_in' )->andReturnSelf();
		$query->allows( 'order_by_desc' )->andReturnSelf();
		$query->allows( 'limit' )->andReturnSelf();
		$query->expects( 'find_many' )->once()->andReturn( [] );

		$this->indexable_repository->expects( 'query' )->once()->andReturn( $query );

		$this->assertSame( [], $this->instance->get_posts( 'page', 20 )->to_array() );
	}
}
