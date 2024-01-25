<?php

namespace Yoast\WP\SEO\Tests\WP\Indexables\Infrastructure;

use WP_Post;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Infrastructure\Outdated_Post_Indexables_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Outdated_Post_Indexables_Repository.
 *
 * @coversDefaultClass Yoast\WP\SEO\Indexables\Infrastructure\Outdated_Post_Indexables_Repository
 */
final class Dismiss_New_Route_Test extends TestCase {

	/**
	 * The post object.
	 *
	 * @var WP_Post
	 */
	protected $post2;

	/**
	 * The instance to test.
	 *
	 * @var Outdated_Post_Indexables_Repository
	 */
	private $instance;

	/**
	 * The id of the author.
	 *
	 * @var int
	 */
	private $user_id;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();
		global $wpdb;

		$this->user_id  = self::factory()->user->create_and_get(
			[
				'user_login' => 'user',
				'user_pass'  => 'password',
			]
		)->ID;
		$this->instance = new Outdated_Post_Indexables_Repository(
			$wpdb,
			\YoastSEO()->helpers->post_type,
			\YoastSEO()->helpers->post,
			\YoastSEO()->classes->get( Indexable_Repository::class )
		);

		$post1 = self::factory()->post->create_and_get(
			[
				'post_type'         => 'post',
				'post_date'         => '2022-09-13 08:50:00',
				'post_modified_gmt' => '2022-09-13 08:50:00',
				'post_status'       => 'publish',
				'post_author'       => $this->user_id,
			]
		);

		$this->post2 = self::factory()->post->create_and_get(
			[
				'post_type'         => 'post',
				'post_date'         => '2022-09-13 08:50:00',
				'post_modified_gmt' => '2022-09-13 08:50:00',
				'post_status'       => 'publish',
				'post_author'       => $this->user_id,
			]
		);
	}

	/**
	 * Tests the get_outdated_post_indexables method.
	 *
	 * @covers ::get_outdated_post_indexables
	 * @covers ::__construct
	 */
	public function test_get_no_outdated_indexables() {
		$last_batch = new Last_Batch_Count( 0 );
		$this->expectException( No_Outdated_Posts_Found_Exception::class );
		$this->instance->get_outdated_post_indexables( $last_batch );
	}

	/**
	 * Tests the get_outdated_post_indexables method.
	 *
	 * @covers ::get_outdated_post_indexables
	 */
	public function test_get_outdated_indexables_with_outdated_post() {
		$last_batch = new Last_Batch_Count( 0 );
		global $wpdb;
		// phpcs:disable WordPress.DB.PreparedSQLPlaceholders.UnsupportedPlaceholder, WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- Will be supported later.
		$db_result = $wpdb->query( $wpdb->prepare( " UPDATE %i SET %i='2022-11-24 13:10:39' where id=%d", [ $wpdb->posts, 'post_modified_gmt', $this->post2->ID ] ) );
		// phpcs:enable
		$result = $this->instance->get_outdated_post_indexables( $last_batch );

		$this->assertSame( $result->count(), 1 );

		$this->assertSame( (int) $result->current()->ID, (int) $this->post2->ID );
	}
}
