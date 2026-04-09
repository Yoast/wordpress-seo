<?php

namespace Yoast\WP\SEO\Tests\WP\Actions\Indexing;

use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Indexable_Post_Indexation_Action.
 *
 * Verifies that the queries used to find unindexed posts return correct results
 * across a wide range of scenarios, including various post types, indexable versions,
 * missing indexables, and fully indexed sites.
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action
 */
final class Indexable_Post_Indexation_Action_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		global $wpdb;

		// Clean state: remove all posts and indexables so each test controls its own data.
		$wpdb->query( "DELETE FROM {$wpdb->posts}" );
		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );

		$this->clear_transients();

		$this->instance = \YoastSEO()->classes->get( Indexable_Post_Indexation_Action::class );
	}

	/**
	 * Tears down after each test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		$this->clear_transients();

		parent::tear_down();
	}

	/**
	 * Tests that an empty site (no posts) returns zero unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_with_no_posts() {
		$this->assertSame( 0, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that an empty site returns zero for limited count.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_with_no_posts() {
		$this->assertSame( 0, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests that a fully indexed site (all posts have current-version indexables) returns zero.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_fully_indexed() {
		$this->factory()->post->create_many( 3 );
		$this->factory()->post->create_many( 2, [ 'post_type' => 'page' ] );

		// The Indexable_Post_Watcher auto-creates current-version indexables for each post.
		$this->assertSame( 0, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that a fully indexed site returns zero for limited count.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_fully_indexed() {
		$this->factory()->post->create_many( 5 );

		$this->assertSame( 0, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests that a completely unindexed site returns the total post count.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_with_no_indexables() {
		$this->factory()->post->create_many( 3 );
		$this->factory()->post->create_many( 2, [ 'post_type' => 'page' ] );

		$this->delete_all_indexables();

		$this->assertSame( 5, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that a completely unindexed site returns correct limited count.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_with_no_indexables() {
		$this->factory()->post->create_many( 5 );

		$this->delete_all_indexables();

		$this->assertSame( 5, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests partially indexed site: only posts without indexables are counted.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_partially_indexed() {
		$post_ids = $this->factory()->post->create_many( 5 );

		// Remove indexables for 3 out of 5 posts.
		$this->delete_indexables_for_posts( \array_slice( $post_ids, 0, 3 ) );

		$this->assertSame( 3, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that posts with outdated-version indexables are counted as unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_all_outdated_version() {
		$this->factory()->post->create_many( 4 );

		// Downgrade all indexable versions to 1 (outdated).
		$this->set_all_indexable_versions( 1 );

		$this->assertSame( 4, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that outdated-version indexables are counted as unindexed for limited count.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_all_outdated_version() {
		$this->factory()->post->create_many( 4 );

		$this->set_all_indexable_versions( 1 );

		$this->assertSame( 4, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests a mix of current and outdated version indexables.
	 * Only posts with outdated versions should be counted.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_mixed_versions() {
		$post_ids = $this->factory()->post->create_many( 5 );

		// Set 3 out of 5 to outdated version.
		$this->set_indexable_versions_for_posts( \array_slice( $post_ids, 0, 3 ), 1 );

		$this->assertSame( 3, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests a mix of missing indexables and outdated-version indexables.
	 * Both should be counted as unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_mix_of_missing_and_outdated() {
		$post_ids = $this->factory()->post->create_many( 6 );

		// Delete indexables for first 2 posts (missing).
		$this->delete_indexables_for_posts( \array_slice( $post_ids, 0, 2 ) );

		// Downgrade version for next 2 posts (outdated).
		$this->set_indexable_versions_for_posts( \array_slice( $post_ids, 2, 2 ), 1 );

		// Last 2 posts remain at current version (indexed).
		// Expected: 2 missing + 2 outdated = 4 unindexed.
		$this->assertSame( 4, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that the limited count also handles a mix of missing and outdated.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_mix_of_missing_and_outdated() {
		$post_ids = $this->factory()->post->create_many( 6 );

		$this->delete_indexables_for_posts( \array_slice( $post_ids, 0, 2 ) );
		$this->set_indexable_versions_for_posts( \array_slice( $post_ids, 2, 2 ), 1 );

		$this->assertSame( 4, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests that multiple post types are all counted correctly.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_multiple_post_types() {
		$post_ids = $this->factory()->post->create_many( 3 );
		$page_ids = $this->factory()->post->create_many( 2, [ 'post_type' => 'page' ] );

		// Remove indexables for 1 post and 1 page.
		$this->delete_indexables_for_posts( [ $post_ids[0], $page_ids[0] ] );

		$this->assertSame( 2, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that auto-draft posts are excluded from the count.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_excludes_auto_draft() {
		$this->factory()->post->create_many( 2, [ 'post_status' => 'publish' ] );
		$this->factory()->post->create_many( 3, [ 'post_status' => 'auto-draft' ] );

		$this->delete_all_indexables();

		// Only the 2 published posts should be counted.
		$this->assertSame( 2, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that auto-draft posts are excluded from the limited count.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_excludes_auto_draft() {
		$this->factory()->post->create_many( 2, [ 'post_status' => 'publish' ] );
		$this->factory()->post->create_many( 3, [ 'post_status' => 'auto-draft' ] );

		$this->delete_all_indexables();

		$this->assertSame( 2, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests that draft posts (not auto-draft) ARE included in the count.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_includes_drafts() {
		$this->factory()->post->create_many( 2, [ 'post_status' => 'draft' ] );
		$this->factory()->post->create( [ 'post_status' => 'publish' ] );

		$this->delete_all_indexables();

		// All 3 should be counted: drafts are NOT excluded, only auto-drafts are.
		$this->assertSame( 3, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that pending and private posts are included in the count.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_includes_pending_and_private() {
		$this->factory()->post->create( [ 'post_status' => 'pending' ] );
		$this->factory()->post->create( [ 'post_status' => 'private' ] );
		$this->factory()->post->create( [ 'post_status' => 'publish' ] );

		$this->delete_all_indexables();

		$this->assertSame( 3, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that the limited count correctly caps at the provided limit.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_caps_at_limit() {
		$this->factory()->post->create_many( 10 );

		$this->delete_all_indexables();

		$this->assertSame( 3, $this->instance->get_limited_unindexed_count( 3 ) );
	}

	/**
	 * Tests that the limited count returns the actual count when fewer than the limit.
	 *
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_get_limited_unindexed_count_returns_actual_when_fewer_than_limit() {
		$this->factory()->post->create_many( 2 );

		$this->delete_all_indexables();

		$this->assertSame( 2, $this->instance->get_limited_unindexed_count( 25 ) );
	}

	/**
	 * Tests that a post with a current-version indexable is not counted as unindexed,
	 * even when a duplicate outdated-version indexable also exists for the same post.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_post_with_current_and_outdated_indexable_not_counted() {
		$post_id = $this->factory()->post->create();

		// The watcher already created a current-version (2) indexable.
		// Add a duplicate outdated-version (1) indexable for the same post.
		$this->insert_indexable( $post_id, 'post', 1 );

		$this->assertSame( 0, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that a post with only an outdated-version indexable IS counted as unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_post_with_only_outdated_indexable_is_counted() {
		$post_id = $this->factory()->post->create();

		// Replace the current-version indexable with an outdated one.
		$this->delete_indexables_for_posts( [ $post_id ] );
		$this->insert_indexable( $post_id, 'post', 1 );

		$this->assertSame( 1, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that indexables with object_type != 'post' do not satisfy the query.
	 * E.g., a 'term' indexable with the same object_id should not make a post "indexed."
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_non_post_type_indexables_do_not_satisfy_query() {
		$post_ids = $this->factory()->post->create_many( 3 );

		// Delete all auto-created indexables.
		$this->delete_all_indexables();

		// Insert 'term' type indexables for the same object IDs.
		foreach ( $post_ids as $post_id ) {
			$this->insert_indexable_with_type( $post_id, 'term', 2 );
		}

		// Posts should still be counted as unindexed.
		$this->assertSame( 3, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that a registered public custom post type is included in the count.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_custom_public_post_type_is_counted() {
		\register_post_type(
			'yoast_test_book',
			[
				'public' => true,
				'label'  => 'Books',
			]
		);

		$this->factory()->post->create(
			[
				'post_type'   => 'yoast_test_book',
				'post_status' => 'publish',
			]
		);

		$this->delete_all_indexables();
		$this->clear_transients();

		$this->assertSame( 1, $this->instance->get_total_unindexed() );

		\unregister_post_type( 'yoast_test_book' );
	}

	/**
	 * Tests that a custom post type mixed with standard types counts correctly.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_custom_post_type_mixed_with_standard_types() {
		\register_post_type(
			'yoast_test_event',
			[
				'public' => true,
				'label'  => 'Events',
			]
		);

		$this->factory()->post->create_many( 2 );
		$this->factory()->post->create( [ 'post_type' => 'page' ] );
		$this->factory()->post->create(
			[
				'post_type'   => 'yoast_test_event',
				'post_status' => 'publish',
			]
		);

		$this->delete_all_indexables();
		$this->clear_transients();

		$this->assertSame( 4, $this->instance->get_total_unindexed() );

		\unregister_post_type( 'yoast_test_event' );
	}

	/**
	 * Tests that COUNT and SELECT queries return consistent results
	 * when the limit is higher than the actual unindexed count.
	 *
	 * @covers ::get_count_query
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_count_and_select_queries_return_consistent_results() {
		$post_ids = $this->factory()->post->create_many( 8 );

		// Make 5 posts unindexed (3 missing, 2 outdated).
		$this->delete_indexables_for_posts( \array_slice( $post_ids, 0, 3 ) );
		$this->set_indexable_versions_for_posts( \array_slice( $post_ids, 3, 2 ), 1 );

		$total = $this->instance->get_total_unindexed();

		$this->clear_transients();

		$limited = $this->instance->get_limited_unindexed_count( 100 );

		$this->assertSame( $total, $limited );
		$this->assertSame( 5, $total );
	}

	/**
	 * Tests a large mix scenario: many post types, statuses, versions, and missing indexables.
	 *
	 * @covers ::get_count_query
	 * @covers ::get_select_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_limited_unindexed_count
	 *
	 * @return void
	 */
	public function test_comprehensive_mixed_scenario() {
		// 3 published posts: 1 indexed, 1 outdated, 1 missing indexable.
		$published_posts = $this->factory()->post->create_many( 3 );

		// 2 pages: 1 indexed, 1 missing indexable.
		$pages = $this->factory()->post->create_many( 2, [ 'post_type' => 'page' ] );

		// 2 drafts: both missing indexables.
		$drafts = $this->factory()->post->create_many( 2, [ 'post_status' => 'draft' ] );

		// 2 auto-drafts: should NOT be counted regardless.
		$this->factory()->post->create_many( 2, [ 'post_status' => 'auto-draft' ] );

		// Set up indexable states:
		// published_posts[0]: keep current version (indexed).
		// published_posts[1]: downgrade to version 1 (outdated).
		$this->set_indexable_versions_for_posts( [ $published_posts[1] ], 1 );
		// published_posts[2]: delete indexable (missing).
		$this->delete_indexables_for_posts( [ $published_posts[2] ] );

		// pages[0]: keep current version (indexed).
		// pages[1]: delete indexable (missing).
		$this->delete_indexables_for_posts( [ $pages[1] ] );

		// drafts: delete indexables (missing).
		$this->delete_indexables_for_posts( $drafts );

		// Expected unindexed:
		// published_posts[1] (outdated) + published_posts[2] (missing) +
		// pages[1] (missing) + 2 drafts (missing) = 5.
		// Auto-drafts are excluded.
		$total = $this->instance->get_total_unindexed();
		$this->assertSame( 5, $total );

		$this->clear_transients();

		$limited = $this->instance->get_limited_unindexed_count( 100 );
		$this->assertSame( 5, $limited );

		$this->clear_transients();

		// With a tight limit, only returns up to the limit.
		$limited_tight = $this->instance->get_limited_unindexed_count( 2 );
		$this->assertSame( 2, $limited_tight );
	}

	/**
	 * Tests that version 0 indexables are treated as unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_version_zero_indexable_treated_as_unindexed() {
		$post_id = $this->factory()->post->create();

		$this->delete_indexables_for_posts( [ $post_id ] );
		$this->insert_indexable( $post_id, 'post', 0 );

		$this->assertSame( 1, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that a very high version number indexable (not matching current) is treated as unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action::get_total_unindexed
	 *
	 * @return void
	 */
	public function test_future_version_indexable_treated_as_unindexed() {
		$post_id = $this->factory()->post->create();

		$this->delete_indexables_for_posts( [ $post_id ] );
		$this->insert_indexable( $post_id, 'post', 99 );

		$this->assertSame( 1, $this->instance->get_total_unindexed() );
	}

	/**
	 * Deletes all indexable records and clears transients.
	 *
	 * @return void
	 */
	private function delete_all_indexables(): void {
		global $wpdb;

		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );
		$this->clear_transients();
	}

	/**
	 * Deletes indexable records for specific post IDs.
	 *
	 * @param int[] $post_ids The post IDs to delete indexables for.
	 *
	 * @return void
	 */
	private function delete_indexables_for_posts( array $post_ids ): void {
		global $wpdb;

		foreach ( $post_ids as $post_id ) {
			$wpdb->delete(
				$wpdb->prefix . 'yoast_indexable',
				[
					'object_id'   => $post_id,
					'object_type' => 'post',
				]
			);
		}

		$this->clear_transients();
	}

	/**
	 * Sets the version of all post-type indexables.
	 *
	 * @param int $version The version to set.
	 *
	 * @return void
	 */
	private function set_all_indexable_versions( int $version ): void {
		global $wpdb;

		$wpdb->update(
			$wpdb->prefix . 'yoast_indexable',
			[ 'version' => $version ],
			[ 'object_type' => 'post' ]
		);

		$this->clear_transients();
	}

	/**
	 * Sets the indexable version for specific post IDs.
	 *
	 * @param int[] $post_ids The post IDs to update.
	 * @param int   $version  The version to set.
	 *
	 * @return void
	 */
	private function set_indexable_versions_for_posts( array $post_ids, int $version ): void {
		global $wpdb;

		foreach ( $post_ids as $post_id ) {
			$wpdb->update(
				$wpdb->prefix . 'yoast_indexable',
				[ 'version' => $version ],
				[
					'object_id'   => $post_id,
					'object_type' => 'post',
				]
			);
		}

		$this->clear_transients();
	}

	/**
	 * Inserts an indexable record for a post with a specific version.
	 *
	 * @param int    $post_id   The post ID.
	 * @param string $post_type The post type (e.g., 'post', 'page').
	 * @param int    $version   The indexable version.
	 *
	 * @return void
	 */
	private function insert_indexable( int $post_id, string $post_type, int $version ): void {
		global $wpdb;

		$wpdb->insert(
			$wpdb->prefix . 'yoast_indexable',
			[
				'object_id'       => $post_id,
				'object_type'     => 'post',
				'object_sub_type' => $post_type,
				'version'         => $version,
				'blog_id'         => \get_current_blog_id(),
				'created_at'      => \current_time( 'mysql' ),
				'updated_at'      => \current_time( 'mysql' ),
			]
		);
	}

	/**
	 * Inserts an indexable record with a specific object_type (not necessarily 'post').
	 *
	 * @param int    $object_id   The object ID.
	 * @param string $object_type The object type (e.g., 'term', 'user').
	 * @param int    $version     The indexable version.
	 *
	 * @return void
	 */
	private function insert_indexable_with_type( int $object_id, string $object_type, int $version ): void {
		global $wpdb;

		$wpdb->insert(
			$wpdb->prefix . 'yoast_indexable',
			[
				'object_id'   => $object_id,
				'object_type' => $object_type,
				'version'     => $version,
				'blog_id'     => \get_current_blog_id(),
				'created_at'  => \current_time( 'mysql' ),
				'updated_at'  => \current_time( 'mysql' ),
			]
		);
	}

	/**
	 * Clears all indexation-related transients to ensure queries actually run.
	 *
	 * @return void
	 */
	private function clear_transients(): void {
		\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
		\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );
	}
}
