<?php

namespace Yoast\WP\SEO\Tests\WP\Actions\Indexing;

use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration test class for Indexable_Term_Indexation_Action::index().
 *
 * Verifies that the index() method correctly creates indexables for unindexed terms
 * via the batched find_by_multiple_ids_and_type repository call.
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action
 */
final class Indexable_Term_Indexation_Action_Index_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Indexable_Term_Indexation_Action
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

		// Clean state: remove all terms and indexables so each test controls its own data.
		$wpdb->query( "DELETE FROM {$wpdb->terms}" );
		$wpdb->query( "DELETE FROM {$wpdb->term_taxonomy}" );
		$wpdb->query( "DELETE FROM {$wpdb->term_relationships}" );
		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );

		$this->clear_transients();

		$this->instance = \YoastSEO()->classes->get( Indexable_Term_Indexation_Action::class );
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
	 * Tests that index() returns an empty array when there are no terms.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_with_no_terms() {
		$this->assertSame( [], $this->instance->index() );
	}

	/**
	 * Tests that index() returns an empty array when every term already has a current-version indexable.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_when_fully_indexed() {
		$this->factory()->category->create_many( 5 );

		// The term watcher already created current-version indexables, so nothing is left to index.
		$this->assertSame( [], $this->instance->index() );
	}

	/**
	 * Tests that index() creates and returns indexables for terms that are missing them.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_creates_missing_indexables() {
		$term_ids = $this->factory()->category->create_many( 5 );

		$this->delete_all_indexables();

		$indexables = $this->instance->index();

		$this->assertCount( 5, $indexables );
		foreach ( $indexables as $indexable ) {
			$this->assertInstanceOf( Indexable::class, $indexable );
			$this->assertSame( 'term', $indexable->object_type );
			$this->assertContains( (int) $indexable->object_id, $term_ids );
		}

		// All five terms should now have an indexable in the database.
		$this->assertSame( 5, $this->count_indexables_for_terms( $term_ids ) );
	}

	/**
	 * Tests that index() processes only the unindexed terms on a partially indexed site.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_partially_indexed() {
		$term_ids = $this->factory()->category->create_many( 6 );

		$unindexed_ids = \array_slice( $term_ids, 0, 4 );
		$this->delete_indexables_for_terms( $unindexed_ids );

		$indexables = $this->instance->index();

		$this->assertCount( 4, $indexables );

		$returned_ids = $this->extract_object_ids( $indexables );
		\sort( $returned_ids );
		\sort( $unindexed_ids );
		$this->assertSame( $unindexed_ids, $returned_ids );
	}

	/**
	 * Tests that terms across multiple taxonomies are all processed.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_with_multiple_taxonomies() {
		$category_ids = $this->factory()->category->create_many( 3 );
		$tag_ids      = $this->factory()->tag->create_many( 2 );

		$this->delete_all_indexables();

		$indexables = $this->instance->index();

		$this->assertCount( 5, $indexables );

		$returned_ids = $this->extract_object_ids( $indexables );
		$expected     = \array_merge( $category_ids, $tag_ids );
		\sort( $returned_ids );
		\sort( $expected );
		$this->assertSame( $expected, $returned_ids );
	}

	/**
	 * Tests that index() clears the unindexed-count transients after processing indexables.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_clears_transients_when_indexables_processed() {
		$this->factory()->category->create_many( 2 );

		$this->delete_all_indexables();

		\set_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT, 5, \HOUR_IN_SECONDS );
		\set_transient( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT, 5, \HOUR_IN_SECONDS );

		$this->instance->index();

		$this->assertFalse( \get_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT ) );
		$this->assertFalse( \get_transient( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT ) );
	}

	/**
	 * Tests that index() leaves the transients intact when no indexables are produced.
	 *
	 * @covers ::index
	 *
	 * @return void
	 */
	public function test_index_does_not_clear_transients_when_no_unindexed() {
		\set_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT, 7, \HOUR_IN_SECONDS );
		\set_transient( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT, 7, \HOUR_IN_SECONDS );

		$this->instance->index();

		$this->assertSame( 7, \get_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT ) );
		$this->assertSame( 7, \get_transient( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT ) );
	}

	/**
	 * Extracts the object_id values from a list of indexables.
	 *
	 * @param Indexable[] $indexables The indexables.
	 *
	 * @return int[] The object_id values cast to int.
	 */
	private function extract_object_ids( array $indexables ): array {
		$ids = [];
		foreach ( $indexables as $indexable ) {
			$ids[] = (int) $indexable->object_id;
		}

		return $ids;
	}

	/**
	 * Counts the number of term-type indexables in the database for the given term IDs.
	 *
	 * @param int[] $term_ids The term IDs.
	 *
	 * @return int The count of matching indexables.
	 */
	private function count_indexables_for_terms( array $term_ids ): int {
		global $wpdb;

		$placeholders = \implode( ',', \array_fill( 0, \count( $term_ids ), '%d' ) );

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}yoast_indexable WHERE object_type = 'term' AND object_id IN ($placeholders)"; // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- $placeholders is a safe list of %d tokens.

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- The query is prepared on the next line.
		return (int) $wpdb->get_var( $wpdb->prepare( $sql, $term_ids ) );
	}

	/**
	 * Deletes all indexable records and clears the related transients.
	 *
	 * @return void
	 */
	private function delete_all_indexables(): void {
		global $wpdb;

		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );
		$this->clear_transients();
	}

	/**
	 * Deletes the term-type indexables for specific term IDs.
	 *
	 * @param int[] $term_ids The term IDs to delete indexables for.
	 *
	 * @return void
	 */
	private function delete_indexables_for_terms( array $term_ids ): void {
		global $wpdb;

		foreach ( $term_ids as $term_id ) {
			$wpdb->delete(
				$wpdb->prefix . 'yoast_indexable',
				[
					'object_id'   => $term_id,
					'object_type' => 'term',
				],
			);
		}

		$this->clear_transients();
	}

	/**
	 * Clears all indexation-related transients to ensure queries actually run.
	 *
	 * @return void
	 */
	private function clear_transients(): void {
		\delete_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
		\delete_transient( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );
	}
}
