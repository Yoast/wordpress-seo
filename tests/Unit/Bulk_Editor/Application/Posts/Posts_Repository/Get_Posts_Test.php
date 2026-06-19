<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Posts\Posts_Repository;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;

/**
 * Tests get_posts.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Repository::get_posts
 */
final class Get_Posts_Test extends Abstract_Posts_Repository_Test {

	/**
	 * Tests that the indexable collector is used when indexables are active.
	 *
	 * @return void
	 */
	public function test_get_posts_uses_indexable_collector_when_indexing() {
		$query      = new Posts_Query( 'page', 1, 20, '', [ 'publish' ] );
		$posts_page = new Posts_Page( new Posts_List(), 0, 1, 20 );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturnTrue();

		$this->indexable_posts_collector
			->expects( 'get_posts' )
			->once()
			->with( $query )
			->andReturn( $posts_page );

		$this->post_meta_posts_collector->expects( 'get_posts' )->never();

		$this->assertSame( $posts_page, $this->instance->get_posts( $query ) );
	}

	/**
	 * Tests that the post meta collector is used when indexables are disabled.
	 *
	 * @return void
	 */
	public function test_get_posts_uses_post_meta_collector_when_not_indexing() {
		$query      = new Posts_Query( 'page', 1, 20, '', [ 'publish' ] );
		$posts_page = new Posts_Page( new Posts_List(), 0, 1, 20 );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturnFalse();

		$this->post_meta_posts_collector
			->expects( 'get_posts' )
			->once()
			->with( $query )
			->andReturn( $posts_page );

		$this->indexable_posts_collector->expects( 'get_posts' )->never();

		$this->assertSame( $posts_page, $this->instance->get_posts( $query ) );
	}
}
