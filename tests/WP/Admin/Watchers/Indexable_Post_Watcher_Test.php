<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Watchers;

use WP_Post;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Models\Indexable_Hierarchy;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Tests the post watcher, which creates indexables and related objects when a post object is created/updated/deleted.
 *
 * TODO: add tests for
 * - Attachments
 * - Multisite (while being switched)
 * - Setting/updating the has_public_posts property
 * - Building links
 * - Unexpected filter/hook input
 * - Building author indexables
 * - Unhappy paths
 */
final class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * An indexable should be created whenever a post is created.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher::build_indexable
	 * @covers \Yoast\WP\SEO\Builders\Indexable_Builder::build
	 *
	 * @return void
	 */
	public function test_create_post() {
		$post = $this->factory()->post->create_and_get();

		$indexables = $this->get_indexables_for( $post );

		$this->assertCount( 1, $indexables );
	}

	/**
	 * The indexable should be deleted when the post is deleted.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher::delete_indexable
	 *
	 * @return void
	 */
	public function test_delete_post() {
		$post = $this->factory()->post->create_and_get();

		\wp_delete_post( $post->ID, true );

		$indexables = $this->get_indexables_for( $post );

		$this->assertCount( 0, $indexables );
	}

	/**
	 * The deletion of the indexable removal should be idempotent: removing a post that had its indexable removed
	 * (or not created) should result in there being no indexable.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher::delete_indexable
	 *
	 * @return void
	 */
	public function test_delete_post_indexable_removed_after_creation() {
		$post = $this->factory()->post->create_and_get();

		$this->delete_indexables_for( $post );
		$indexables = $this->get_indexables_for( $post );

		$this->assertCount( 0, $indexables );

		\wp_delete_post( $post->ID, true );

		$this->assertCount( 0, $indexables );
	}

	/**
	 * An indexable hierarchy should be created whenever a post is created.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher::build_indexable
	 * @covers \Yoast\WP\SEO\Builders\Indexable_Builder::build
	 *
	 * @return void
	 */
	public function test_create_post_with_hierarchy() {
		$parent = $this->factory()->post->create_and_get(
			[
				'post_type' => 'page',
			]
		);
		$child  = $this->factory()->post->create_and_get(
			[
				'post_type'   => 'page',
				'post_parent' => $parent->ID,
			]
		);

		$parent_indexable = \current( $this->get_indexables_for( $parent ) );
		$child_indexable  = \current( $this->get_indexables_for( $child ) );

		$parent_hierarchy = $this->get_hierarchy_for( $parent_indexable );
		$child_hierarchy  = $this->get_hierarchy_for( $child_indexable );

		$this->assertCount( 1, $parent_hierarchy );
		$this->assertCount( 1, $child_hierarchy );
		$this->assertSame( $parent_hierarchy[0]->ancestor_id, 0 );
		$this->assertSame( $child_hierarchy[0]->ancestor_id, (int) $parent_indexable->id() );
	}

	/**
	 * Indexable hierarchy should be deleted whenever a post is deleted.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher::delete_indexable
	 *
	 * @return void
	 */
	public function test_delete_post_with_hierarchy() {
		$parent = $this->factory()->post->create_and_get(
			[
				'post_type' => 'page',
			]
		);
		$child  = $this->factory()->post->create_and_get(
			[
				'post_type'   => 'page',
				'post_parent' => $parent->ID,
			]
		);

		$parent_indexable = \current( $this->get_indexables_for( $parent ) );
		$child_indexable  = \current( $this->get_indexables_for( $child ) );

		\wp_delete_post( $parent->ID, true );

		$parent_hierarchy = $this->get_hierarchy_for( $parent_indexable );
		$child_hierarchy  = $this->get_hierarchy_for( $child_indexable );

		$this->assertCount( 0, $parent_hierarchy );
		$this->assertCount( 1, $child_hierarchy );
	}

	/**
	 * Gets all indexable records for a post.
	 *
	 * @param WP_Post $post The post to get indexables for.
	 *
	 * @return Indexable[] The indexbales for hte post.
	 */
	protected function get_indexables_for( WP_Post $post ) {
		$orm = Model::of_type( 'Indexable' );

		return $orm
			->where( 'object_id', $post->ID )
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', $post->post_type )
			->find_many();
	}

	/**
	 * Deletes all indexable records for a post.
	 *
	 * @param WP_Post $post The post to delete indexables for.
	 *
	 * @return int|bool The number of deleted records. False on failure.
	 */
	protected function delete_indexables_for( WP_Post $post ) {
		$orm = Model::of_type( 'Indexable' );

		return $orm
			->where( 'object_id', $post->ID )
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', $post->post_type )
			->delete_many();
	}

	/**
	 * Gets indexable hierarchy records for a particular indexable.
	 *
	 * @param Indexable $indexable The indexable to build hierarchy for.
	 *
	 * @return Indexable_Hierarchy[] THe hierarchy objects for the indexable.
	 */
	protected function get_hierarchy_for( Indexable $indexable ) {
		$orm = Model::of_type( 'Indexable_Hierarchy' );

		return $orm
			->where( 'indexable_id', $indexable->id() )
			->find_many();
	}
}
