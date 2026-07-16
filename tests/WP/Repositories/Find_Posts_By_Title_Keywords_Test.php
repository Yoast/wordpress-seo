<?php

namespace Yoast\WP\SEO\Tests\WP\Repositories;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration test class for Indexable_Repository::find_posts_by_title_keywords.
 *
 * @group indexables
 * @group repositories
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Repository
 */
final class Find_Posts_By_Title_Keywords_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Indexable_Repository
	 */
	private $instance;

	/**
	 * Counter used to give each inserted indexable a unique permalink.
	 *
	 * @var int
	 */
	private $row_index = 0;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		global $wpdb;

		// Start from a clean indexable table so only the rows under test match.
		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );

		$this->instance = \YoastSEO()->classes->get( Indexable_Repository::class );
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		global $wpdb;

		$wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_indexable" );

		parent::tear_down();
	}

	/**
	 * Tests that a single value matches as a substring and excludes non-matching titles.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_matches_phrase_as_substring(): void {
		$this->insert_indexable( 'Hiking Boots Review', '2024-01-01 10:00:00' );
		$this->insert_indexable( 'Best Hiking Boots 2026', '2024-01-02 10:00:00' );
		$this->insert_indexable( 'Trail Running Guide', '2024-01-03 10:00:00' );

		$titles = $this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( 'hiking boots' ) );

		$this->assertCount( 2, $titles );
		$this->assertContains( 'Hiking Boots Review', $titles );
		$this->assertContains( 'Best Hiking Boots 2026', $titles );
		$this->assertNotContains( 'Trail Running Guide', $titles );
	}

	/**
	 * Tests that comma-separated values are unioned (a post matching any value is returned).
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_comma_separated_values_are_unioned(): void {
		$this->insert_indexable( 'Hiking Boots Review', '2024-01-01 10:00:00' );
		$this->insert_indexable( 'Best Hiking Boots 2026', '2024-01-02 10:00:00' );
		$this->insert_indexable( 'Trail Running Guide', '2024-01-03 10:00:00' );

		$titles = $this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( 'hiking boots, trail' ) );

		$this->assertCount( 3, $titles );
		$this->assertContains( 'Hiking Boots Review', $titles );
		$this->assertContains( 'Best Hiking Boots 2026', $titles );
		$this->assertContains( 'Trail Running Guide', $titles );
	}

	/**
	 * Tests that a value is matched as a whole phrase, not as individual non-adjacent words.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_matches_whole_phrase_not_individual_words(): void {
		$this->insert_indexable( 'Hiking Boots Review', '2024-01-01 10:00:00' );

		// "Hiking Boots Review" contains both words but not the contiguous phrase "boots hiking".
		$this->assertSame( [], $this->instance->find_posts_by_title_keywords( 'boots hiking' ) );
	}

	/**
	 * Tests that results are paginated, newest first, with later pages reaching older matches.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_paginates_newest_first(): void {
		// Insert 11 matches oldest (01) to newest (11); the page size is 10.
		for ( $i = 1; $i <= 11; $i++ ) {
			$this->insert_indexable(
				\sprintf( 'Zephyrwidget %02d', $i ),
				\sprintf( '2024-01-%02d 10:00:00', $i ),
			);
		}

		$first_page = $this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( 'Zephyrwidget', 1 ) );

		// Page one returns the 10 most recently modified, newest first.
		$expected_first_page = [];
		for ( $i = 11; $i >= 2; $i-- ) {
			$expected_first_page[] = \sprintf( 'Zephyrwidget %02d', $i );
		}

		$this->assertSame( $expected_first_page, $first_page );

		// Page two returns the single oldest remaining match.
		$this->assertSame(
			[ 'Zephyrwidget 01' ],
			$this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( 'Zephyrwidget', 2 ) ),
		);

		// A page beyond the last match is empty, signalling there are no further pages.
		$this->assertSame( [], $this->instance->find_posts_by_title_keywords( 'Zephyrwidget', 3 ) );
	}

	/**
	 * Tests that non-public posts (drafts, noindexed or protected posts) are matched too.
	 *
	 * The ability consuming this search is capability-gated, and posts resolved by ID or
	 * permalink are not filtered on visibility either, so a title search must not hide
	 * non-public posts.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_matches_non_public_posts(): void {
		$this->insert_indexable( 'Visibleword Published', '2024-01-03 10:00:00', 1 );
		$this->insert_indexable( 'Visibleword Noindexed', '2024-01-02 10:00:00', 0 );
		$this->insert_indexable( 'Visibleword Unset', '2024-01-01 10:00:00', null );

		$titles = $this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( 'Visibleword' ) );

		$this->assertSame(
			[ 'Visibleword Published', 'Visibleword Noindexed', 'Visibleword Unset' ],
			$titles,
		);
	}

	/**
	 * Tests that an empty or comma-only search never matches every post.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_empty_search_returns_no_results(): void {
		$this->insert_indexable( 'Hiking Boots Review', '2024-01-01 10:00:00' );

		$this->assertSame( [], $this->instance->find_posts_by_title_keywords( '   ' ) );
		$this->assertSame( [], $this->instance->find_posts_by_title_keywords( ', ,' ) );
	}

	/**
	 * Tests that only the first MAX_TITLE_KEYWORD_PHRASES phrases are honoured per request.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_caps_the_number_of_phrases_per_request(): void {
		$cap = Indexable_Repository::MAX_TITLE_KEYWORD_PHRASES;

		// The first $cap phrases match older posts; the phrase beyond the cap matches the single newest post.
		$keywords = [];
		for ( $i = 1; $i <= $cap; $i++ ) {
			$this->insert_indexable( \sprintf( 'Capword %02d', $i ), \sprintf( '2024-01-%02d 10:00:00', $i ) );
			$keywords[] = \sprintf( 'Capword %02d', $i );
		}
		$beyond_cap_title = \sprintf( 'Capword %02d', ( $cap + 1 ) );
		$this->insert_indexable( $beyond_cap_title, '2024-02-01 10:00:00' );
		$keywords[] = $beyond_cap_title;

		$titles = $this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( \implode( ', ', $keywords ) ) );

		// The phrase beyond the cap is ignored, so its (newest) post is absent despite being most recently modified.
		$this->assertCount( $cap, $titles );
		$this->assertNotContains( $beyond_cap_title, $titles );
	}

	/**
	 * Tests that a page size below one is clamped to one rather than returning nothing or erroring.
	 *
	 * @covers ::find_posts_by_title_keywords
	 *
	 * @return void
	 */
	public function test_clamps_page_size_below_one(): void {
		$this->insert_indexable( 'Clampword Older', '2024-01-01 10:00:00' );
		$this->insert_indexable( 'Clampword Newer', '2024-01-02 10:00:00' );

		// A page size of 0 or a negative value must clamp to 1, returning the single newest match.
		foreach ( [ 0, -5 ] as $page_size ) {
			$this->assertSame(
				[ 'Clampword Newer' ],
				$this->breadcrumb_titles( $this->instance->find_posts_by_title_keywords( 'Clampword', 1, $page_size ) ),
			);
		}
	}

	/**
	 * Maps a list of indexables to their breadcrumb titles, preserving order.
	 *
	 * @param array<Indexable> $indexables The indexables.
	 *
	 * @return array<string> The breadcrumb titles.
	 */
	private function breadcrumb_titles( array $indexables ): array {
		return \array_map(
			static function ( $indexable ) {
				return $indexable->breadcrumb_title;
			},
			$indexables,
		);
	}

	/**
	 * Inserts a post indexable with the given title, modification date, and visibility.
	 *
	 * @param string   $breadcrumb_title     The breadcrumb title to match against.
	 * @param string   $object_last_modified The modification timestamp used for ordering.
	 * @param int|null $is_public            The is_public value; null when no override is set.
	 *
	 * @return void
	 */
	private function insert_indexable( string $breadcrumb_title, string $object_last_modified, ?int $is_public = 1 ): void {
		global $wpdb;

		++$this->row_index;
		$permalink = 'https://example.com/p-' . $this->row_index;

		$wpdb->insert(
			$wpdb->prefix . 'yoast_indexable',
			[
				'object_type'          => 'post',
				'object_sub_type'      => 'post',
				'post_status'          => 'publish',
				'is_public'            => $is_public,
				'permalink'            => $permalink,
				'permalink_hash'       => \strlen( $permalink ) . ':' . \md5( $permalink ),
				'object_last_modified' => $object_last_modified,
				'created_at'           => '2024-01-01 10:00:00',
				'updated_at'           => '2024-01-01 10:00:00',
				'blog_id'              => \get_current_blog_id(),
				'version'              => 2,
				'breadcrumb_title'     => $breadcrumb_title,
			],
		);
	}
}
