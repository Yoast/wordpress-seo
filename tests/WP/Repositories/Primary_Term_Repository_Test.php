<?php

namespace Yoast\WP\SEO\Tests\WP\Repositories;

use Yoast\WP\SEO\Models\Primary_Term;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Primary_Term_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Primary_Term_Repository
 */
final class Primary_Term_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Primary_Term_Repository
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();
		global $wpdb;

		$wpdb->insert(
			$wpdb->prefix . 'yoast_primary_term',
			[
				'id'         => '123',
				'post_id'    => '110',
				'term_id'    => '22',
				'taxonomy'   => 'category',
				'created_at' => '2024-05-22 10:16:42',
				'updated_at' => '2024-05-22 10:16:42',
				'blog_id'    => '1',
			]
		);

		$this->instance = new Primary_Term_Repository();
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		global $wpdb;

		$wpdb->query( "TRUNCATE TABLE {$wpdb->prefix}yoast_primary_term" );

		parent::tear_down();
	}

	/**
	 * Tests the query method.
	 *
	 * @covers ::query
	 *
	 * @return void
	 */
	public function test_query() {

		$this->assertIsObject( $this->instance->query() );
	}

	/**
	 * Tests finding one entry by post id and taxonomy.
	 *
	 * @covers ::find_by_post_id_and_taxonomy
	 *
	 * @return void
	 */
	public function test_find_by_post_id_and_taxonomy_one_result() {

		$post_id  = 110;
		$taxonomy = 'category';

		$result = $this->instance->find_by_post_id_and_taxonomy( $post_id, $taxonomy );

		$this->assertInstanceOf( Primary_Term::class, $result, 'The result should be a Primary_term instance.' );
		$this->assertEquals( '123', $result->id, 'The id of the one result should be the one we expect.' );
	}

	/**
	 * Tests finding no entry by post id and taxonomy.
	 *
	 * @covers ::find_by_post_id_and_taxonomy
	 *
	 * @return void
	 */
	public function test_find_by_post_id_and_taxonomy_no_result() {
		$post_id  = 111;
		$taxonomy = 'category';

		$result = $this->instance->find_by_post_id_and_taxonomy( $post_id, $taxonomy, false );

		$this->assertFalse( $result, 'The result should be false' );
	}
}
