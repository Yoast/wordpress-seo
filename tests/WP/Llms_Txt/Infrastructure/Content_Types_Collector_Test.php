<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Llms_Txt\Infrastructure;

use WPSEO_Options;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Content_Types_Collector_Test
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector::get_posts
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector::get_recent_cornerstone_content
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector::get_recent_posts
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector::get_recently_modified_posts_indexables
 * @covers Yoast\WP\SEO\Repositories\Indexable_Repository::get_recently_modified_posts
 * @covers Yoast\WP\SEO\Repositories\Indexable_Repository::get_recent_cornerstone_for_post_type
 */
final class Content_Types_Collector_Test extends TestCase {

	/**
	 * Holds the indexable post watcher.
	 *
	 * @var Indexable_Post_Watcher
	 */
	protected $indexable_post_watcher;

	/**
	 * Holds the instance.
	 *
	 * @var Content_Types_Collector
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Content_Types_Collector(
			\YoastSEO()->helpers->post_type,
			\YoastSEO()->helpers->options,
			\YoastSEO()->helpers->indexable,
			\YoastSEO()->classes->get( Indexable_Repository::class ),
			\YoastSEO()->meta
		);

		$this->indexable_post_watcher = \YoastSEO()->classes->get( Indexable_Post_Watcher::class );

		$post_type = 'custom-post-type';
		\register_post_type(
			$post_type,
			[
				'public'       => true,
				'description'  => 'a custom post type',
				'label'        => $post_type,
				'hierarchical' => false,
			]
		);
	}

	/**
	 * Remove the custom post type and taxonomy after each test.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Remove possibly registered post type.
		\unregister_post_type( 'custom-post-type' );

		parent::tear_down();
	}

	/**
	 * Tests getting posts.
	 *
	 * @param string   $post_type                                      The post type to get posts for.
	 * @param int      $number_of_posts                                The number of posts to create.
	 * @param string   $posts_created_at                               Posts creation date.
	 * @param bool     $is_cornerstone_active                          Whether the cornerstone feature is active.
	 * @param int[]    $cornerstone_posts_indexes                      An array of indexes that indicate the cornerstone posts.
	 * @param int[]    $posts_indexes_sorted_by_desc_modification_date An array of indexes that indicate posts sorted by descending modification date.
	 * @param int      $expected_number_of_posts                       The expected number of posts to be returned.
	 * @param string[] $expected_post_titles                           An array of expected post titles in the order they should be returned.
	 *
	 * @dataProvider generate_get_posts
	 *
	 * @return void
	 */
	public function test_get_posts(
		$post_type,
		$number_of_posts,
		$posts_created_at,
		$is_cornerstone_active,
		$cornerstone_posts_indexes,
		$posts_indexes_sorted_by_desc_modification_date,
		$expected_number_of_posts,
		$expected_post_titles
	) {
		WPSEO_Options::set( 'enable_cornerstone_content', $is_cornerstone_active );
		$post_ids = $this->create_posts( $number_of_posts, $post_type, $posts_created_at );
		$this->sets_cornerstone_posts( $cornerstone_posts_indexes, $post_ids );
		$this->sets_modification_dates( $posts_indexes_sorted_by_desc_modification_date, $post_ids );

		$results = $this->instance->get_posts( $post_type, 5 );

		// Assert the expected number of posts are returned.
		$this->assertCount( $expected_number_of_posts, $results );

		$post_titles = [];
		foreach ( $results as $post ) {
			$post_titles[] = $post->get_title();
		}

		// Assert the post titles match the expected titles.
		$this->assertEquals( $expected_post_titles, $post_titles );
	}

	/**
	 * Creates the posts.
	 *
	 * @param int    $number_of_posts  The number of posts to create.
	 * @param string $post_type        The post type to create the posts for.
	 * @param string $posts_created_at Posts creation date.
	 *
	 * @return int[] An array of created post IDs.
	 */
	private function create_posts( $number_of_posts, $post_type, $posts_created_at ) {

		$post_ids = [];
		for ( $i = 1; $i <= $number_of_posts; $i++ ) {
			$post_ids[] = $this->factory()->post->create(
				[
					'post_title'  => 'Test Post ' . $i,
					'post_type'   => $post_type,
					'post_status' => 'publish',
					'post_date'   => \gmdate( 'Y-m-d H:i:s', \strtotime( $posts_created_at ) ),
				]
			);
		}

		return $post_ids;
	}

	/**
	 * Sets the cornerstone posts.
	 *
	 * @param int[] $cornerstone_posts_indexes An array of indexes that indicate the cornerstone posts.
	 * @param int[] $post_ids                  An array of post IDs to set as cornerstone posts.
	 *
	 * @return void
	 */
	private function sets_cornerstone_posts( $cornerstone_posts_indexes, $post_ids ) {
		foreach ( $cornerstone_posts_indexes as $cornerstone_posts_index ) {
			\wp_update_post(
				[
					'ID'         => $post_ids[ ( $cornerstone_posts_index - 1 ) ],
					'meta_input' => [
						'_yoast_wpseo_is_cornerstone' => '1',
					],
				]
			);
		}
	}

	/**
	 * Updates the modification date of the posts to match the provided order.
	 * This is to simulate the posts having been modified at different times
	 *
	 * @param int[] $posts_indexes_sorted_by_desc_modification_date An array of indexes that indicate posts sorted by descending modification date.
	 * @param int[] $post_ids                                       An array of post IDs to set the modification dates for.
	 *
	 * @return void
	 */
	private function sets_modification_dates( $posts_indexes_sorted_by_desc_modification_date, $post_ids ) {
		global $wpdb;
		$counter = 100;
		$now     = \time();
		foreach ( $posts_indexes_sorted_by_desc_modification_date as $post_id ) {
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
		yield '4 posts total with no cornerstone posts' => [
			'post_type'                                      => 'custom-post-type',
			'number_of_posts'                                => 4,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
			],
			'expected_number_of_posts'                       => 4,
			'expected_post_titles'                           => [
				'Test Post 1',
				'Test Post 2',
				'Test Post 3',
				'Test Post 4',
			],
		];
		yield '6 posts total with no cornerstone posts' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [],
			'posts_indexes_sorted_by_desc_modification_date' => [
				6,
				5,
				4,
				3,
				2,
				1,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 6',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 2',
			],
		];
		yield '4 posts total with one cornerstone post that is not the most recently modified one' => [
			'post_type'                                      => 'custom-post-type',
			'number_of_posts'                                => 4,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				1,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				4,
				3,
				2,
				1,
			],
			'expected_number_of_posts'                       => 4,
			'expected_post_titles'                           => [
				'Test Post 1',
				'Test Post 4',
				'Test Post 3',
				'Test Post 2',
			],
		];
		yield '6 pages with 5 cornerstone posts that are also the most recent' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				2,
				3,
				4,
				5,
				6,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				6,
				5,
				4,
				3,
				2,
				1,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 6',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 2',
			],
		];
		yield '7 pages with 6 cornerstone pages that are also the most recent' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 7,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				2,
				3,
				4,
				5,
				6,
				7,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				7,
				6,
				5,
				4,
				3,
				2,
				1,
			],
			'expected_number_of_posts'                       => 6,
			'expected_post_titles'                           => [
				'Test Post 7',
				'Test Post 6',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 2',
			],
		];
		yield '6 pages with 5 cornerstone pages that are not the most recent' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				2,
				3,
				4,
				5,
				6,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				6,
				5,
				4,
				3,
				2,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 6',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 2',
			],
		];
		yield '7 pages with 6 cornerstone pages that are not the most recent' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 7,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				2,
				3,
				4,
				5,
				6,
				7,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				7,
				6,
				5,
				4,
				3,
				2,
			],
			'expected_number_of_posts'                       => 6,
			'expected_post_titles'                           => [
				'Test Post 7',
				'Test Post 6',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 2',
			],
		];
		yield '6 posts, the oldest is cornerstone' => [
			'post_type'                                      => 'custom-post-type',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				6,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
				5,
				6,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 6',
				'Test Post 1',
				'Test Post 2',
				'Test Post 3',
				'Test Post 4',
			],
		];
		yield '6 pages, the oldest is cornerstone, but the cornerstone feature is disabled' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => false,
			'cornerstone_posts_indexes'                      => [
				6,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
				5,
				6,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 1',
				'Test Post 2',
				'Test Post 3',
				'Test Post 4',
				'Test Post 5',
			],
		];
		yield '6 pages and all are cornerstone' => [
			'post_type'                                      => 'page',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				1,
				2,
				3,
				4,
				5,
				6,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				2,
				5,
				4,
				3,
				1,
				6,
			],
			'expected_number_of_posts'                       => 6,
			'expected_post_titles'                           => [
				'Test Post 2',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 1',
				'Test Post 6',
			],
		];
		yield '6 posts and all are cornerstone' => [
			'post_type'                                      => 'custom-post-type',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				1,
				2,
				3,
				4,
				5,
				6,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				2,
				5,
				4,
				3,
				1,
				6,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 2',
				'Test Post 5',
				'Test Post 4',
				'Test Post 3',
				'Test Post 1',
			],
		];
		yield '3 cornerstone posts and 3 regular ones' => [
			'post_type'                                      => 'custom-post-type',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				1,
				3,
				5,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
				4,
				5,
				6,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 1',
				'Test Post 3',
				'Test Post 5',
				'Test Post 2',
				'Test Post 4',
			],
		];
		yield '4 cornerstone posts and 2 regular ones, with the regular ones being the most recently modified' => [
			'post_type'                                      => 'custom-post-type',
			'number_of_posts'                                => 6,
			'posts_created_at'                               => '-6 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				1,
				2,
				3,
				4,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				5,
				6,
				1,
				2,
				3,
				4,
			],
			'expected_number_of_posts'                       => 5,
			'expected_post_titles'                           => [
				'Test Post 1',
				'Test Post 2',
				'Test Post 3',
				'Test Post 4',
				'Test Post 5',
			],
		];
		yield '3 old posts, none of which are cornerstone' => [
			'post_type'                                      => 'post',
			'number_of_posts'                                => 3,
			'posts_created_at'                               => '-16 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [],
			'posts_indexes_sorted_by_desc_modification_date' => [
				1,
				2,
				3,
			],
			'expected_number_of_posts'                       => 0,
			'expected_post_titles'                           => [],
		];
		yield '3 old posts, 2 of which are cornerstone' => [
			'post_type'                                      => 'post',
			'number_of_posts'                                => 3,
			'posts_created_at'                               => '-16 months',
			'is_cornerstone_active'                          => true,
			'cornerstone_posts_indexes'                      => [
				2,
				3,
			],
			'posts_indexes_sorted_by_desc_modification_date' => [
				3,
				2,
			],
			'expected_number_of_posts'                       => 2,
			'expected_post_titles'                           => [
				'Test Post 3',
				'Test Post 2',
			],
		];
	}
}
