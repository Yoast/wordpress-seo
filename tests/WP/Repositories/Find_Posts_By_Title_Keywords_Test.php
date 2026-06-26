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
	 * Inserts a public post indexable with the given title and modification date.
	 *
	 * @param string $breadcrumb_title     The breadcrumb title to match against.
	 * @param string $object_last_modified The modification timestamp used for ordering.
	 *
	 * @return void
	 */
	private function insert_indexable( string $breadcrumb_title, string $object_last_modified ): void {
		global $wpdb;

		++$this->row_index;
		$permalink = 'https://example.com/p-' . $this->row_index;

		$wpdb->insert(
			$wpdb->prefix . 'yoast_indexable',
			[
				'object_type'          => 'post',
				'object_sub_type'      => 'post',
				'post_status'          => 'publish',
				'is_public'            => 1,
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
