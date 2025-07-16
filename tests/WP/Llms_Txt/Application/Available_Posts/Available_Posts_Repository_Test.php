<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Llms_Txt\Application\Available_Posts;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Parameters;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Automatic_Post_Collection;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Available_Posts_Repository_Test
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository::get_posts
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Automatic_Post_Collection::get_recent_posts
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Automatic_Post_Collection::get_recently_modified_posts_indexables
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Automatic_Post_Collection::get_recently_modified_posts_wp_query
 * @covers Yoast\WP\SEO\Repositories\Indexable_Repository::get_recently_modified_posts
 * @covers Yoast\WP\SEO\Repositories\Indexable_Repository::get_recent_cornerstone_for_post_type
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Data_Container::add_data
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Data_Container::to_array
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Available_Posts_Data::to_array
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry::from_meta
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry::from_post
 */
final class Available_Posts_Repository_Test extends TestCase {

	/**
	 * Holds the indexable post watcher.
	 *
	 * @var Indexable_Post_Watcher
	 */
	protected $indexable_post_watcher;

	/**
	 * Holds the instance.
	 *
	 * @var Available_Posts_Repository
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Available_Posts_Repository(
			\YoastSEO()->classes->get( Automatic_Post_Collection::class ),
		);

		$this->indexable_post_watcher = \YoastSEO()->classes->get( Indexable_Post_Watcher::class );

		// Delete all indexables before each test to ensure a clean slate.
		global $wpdb;
		$table = Model::get_table_name( 'Indexable' );
		$wpdb->query( "DELETE FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
	}

	/**
	 * Tests getting posts.
	 *
	 * @param string   $search_filter                                  The search filter to use for getting the posts.
	 * @param int      $number_of_pages                                The number of posts to create.
	 * @param int[]    $pages_indexes_sorted_by_desc_modification_date An array of indexes that indicate posts sorted
	 *                                                                 by descending modification date.
	 * @param bool     $enabled_indexables                             Whether indexables are enabled.
	 * @param int      $expected_number_of_results                     The number of expected posts to retrieve.
	 * @param array<string> $expected_results                               An array of expected post titles in the order
	 *                                                                 they should be returned.
	 *
	 * @dataProvider generate_get_posts
	 *
	 * @return void
	 */
	public function test_get_posts(
		$search_filter,
		$number_of_pages,
		$pages_indexes_sorted_by_desc_modification_date,
		$enabled_indexables,
		$expected_number_of_results,
		$expected_results
	) {
		if ( ! $enabled_indexables ) {
			\add_filter( 'Yoast\WP\SEO\should_index_indexables', '__return_false' );
		}

		$post_ids = $this->create_pages( $number_of_pages );
		$this->sets_modification_dates( $pages_indexes_sorted_by_desc_modification_date, $post_ids );

		$request_parameters = new Parameters( 'page', $search_filter );

		$results = $this->instance->get_posts( $request_parameters )->to_array();

		$this->assertCount( $expected_number_of_results, $results );

		foreach ( $results as $key => $result ) {
			$this->assertEquals( $expected_results[ $key ], $result['title'] );
		}
	}

	/**
	 * Creates the pages.
	 *
	 * @param int $number_of_pages The number of pages to create.
	 *
	 * @return int[] An array of created page IDs.
	 */
	private function create_pages( $number_of_pages ) {
		$post_ids = [];
		for ( $i = 1; $i <= $number_of_pages; $i++ ) {
			$post_ids[] = $this->factory()->post->create(
				[
					'post_title'  => 'Test Page ' . $i,
					'post_type'   => 'page',
					'post_status' => 'publish',
				]
			);
		}

		return $post_ids;
	}

	/**
	 * Updates the modification date of the pages to match the provided order.
	 * This is to simulate the pages having been modified at different times
	 *
	 * @param int[] $pages_indexes_sorted_by_desc_modification_date An array of indexes that indicate pages sorted by
	 *                                                              descending modification date.
	 * @param int[] $post_ids                                       An array of post IDs to set the modification dates
	 *                                                              for.
	 *
	 * @return void
	 */
	private function sets_modification_dates( $pages_indexes_sorted_by_desc_modification_date, $post_ids ) {
		global $wpdb;
		$counter = 100;
		$now     = \time();
		foreach ( $pages_indexes_sorted_by_desc_modification_date as $post_id ) {
			$id_to_update = $post_ids[ ( $post_id - 1 ) ];

			// Directly update the post modification date in the database because wp_update_post() automatically sets it to the current time.
			$wpdb->update(
				$wpdb->posts,
				[
					'post_modified'     => \get_date_from_gmt( \gmdate( 'Y-m-d H:i:s', ( $now - $counter ) ) ),
					'post_modified_gmt' => \get_date_from_gmt( \gmdate( 'Y-m-d H:i:s', ( $now - $counter ) ) ),
				],
				[ 'ID' => $id_to_update ]
			);

			// Clean cache because of direct database tweaks above.
			\clean_post_cache( $id_to_update );

			// Rebuild the indexable for the post, to cascade the modification date change to the indexable.
			$this->indexable_post_watcher->build_indexable( $id_to_update );

			++$counter;
		}
	}

	/**
	 * Provides data for testing get_posts.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_get_posts() {
		yield '4 pages and no search filter' => [
			'search_filter'                                  => '',
			'number_of_pages'                                => 4,
			'pages_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
			],
			'enabled_indexables'                             => true,
			'expected_number_of_results'                     => 4,
			'expected_results'                               => [
				'Test Page 1',
				'Test Page 2',
				'Test Page 3',
				'Test Page 4',
			],
		];
		yield '4 pages and no search filter with disabled indexables' => [
			'search_filter'                                  => '',
			'number_of_pages'                                => 4,
			'pages_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
			],
			'enabled_indexables'                             => false,
			'expected_number_of_results'                     => 4,
			'expected_results'                               => [
				'Test Page 1',
				'Test Page 2',
				'Test Page 3',
				'Test Page 4',
			],
		];
		yield '4 pages and search filter for one of them' => [
			'search_filter'                                  => 'Test Page 2',
			'number_of_pages'                                => 4,
			'pages_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
			],
			'enabled_indexables'                             => true,
			'expected_number_of_results'                     => 1,
			'expected_results'                               => [
				'Test Page 2',
			],
		];
		yield '4 pages and search filter for one of them with disabled indexables' => [
			'search_filter'                                  => 'Test Page 3',
			'number_of_pages'                                => 4,
			'pages_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
			],
			'enabled_indexables'                             => true,
			'expected_number_of_results'                     => 1,
			'expected_results'                               => [
				'Test Page 3',
			],
		];
		yield '6 pages with tangled modification dates' => [
			'search_filter'                                  => '',
			'number_of_pages'                                => 6,
			'pages_indexes_sorted_by_desc_modification_date' => [
				4,
				2,
				3,
				5,
				1,
				6,
			],
			'enabled_indexables'                             => true,
			'expected_number_of_results'                     => 6,
			'expected_results'                               => [
				'Test Page 4',
				'Test Page 2',
				'Test Page 3',
				'Test Page 5',
				'Test Page 1',
				'Test Page 6',
			],
		];
		yield '6 pages with tangled modification dates with disabled indexables' => [
			'search_filter'                                  => '',
			'number_of_pages'                                => 6,
			'pages_indexes_sorted_by_desc_modification_date' => [
				4,
				2,
				3,
				5,
				1,
				6,
			],
			'enabled_indexables'                             => true,
			'expected_number_of_results'                     => 6,
			'expected_results'                               => [
				'Test Page 4',
				'Test Page 2',
				'Test Page 3',
				'Test Page 5',
				'Test Page 1',
				'Test Page 6',
			],
		];
		yield 'No pages' => [
			'search_filter'                                  => '',
			'number_of_pages'                                => 0,
			'pages_indexes_sorted_by_desc_modification_date' => [],
			'enabled_indexables'                             => false,
			'expected_number_of_results'                     => 0,
			'expected_results'                               => [],
		];
		yield 'No pages with disabled indexables' => [
			'search_filter'                                  => '',
			'number_of_pages'                                => 0,
			'pages_indexes_sorted_by_desc_modification_date' => [],
			'enabled_indexables'                             => true,
			'expected_number_of_results'                     => 0,
			'expected_results'                               => [],
		];
	}
}
