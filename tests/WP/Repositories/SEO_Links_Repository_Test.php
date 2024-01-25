<?php

namespace Yoast\WP\SEO\Tests\WP\Repositories;

use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class SEO_Links_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\SEO_Links_Repository
 */
final class SEO_Links_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var SEO_Links_Repository
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
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'                 => 'https://example.com/test',
				'type'                => 'internal',
				'indexable_id'        => '101',
				'post_id'             => '110',
				'target_post_id'      => '112',
				'target_indexable_id' => '344',
				'id'                  => '113',
			]
		);

		$this->instance = new SEO_Links_Repository();
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		global $wpdb;

		$wpdb->query( "TRUNCATE TABLE {$wpdb->prefix}yoast_seo_links" );

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
	 * Tests the find_all_by_post_id method.
	 *
	 * @covers ::find_all_by_post_id
	 *
	 * @return void
	 */
	public function test_find_all_by_post_id_no_result() {

		$post_id = 1;

		$result = $this->instance->find_all_by_post_id( $post_id );

		$this->assertIsArray( $result, 'The result should be an array.' );
		$this->assertEmpty( $result, 'The result should be empty.' );
	}

	/**
	 * Tests the find_all_by_post_id method.
	 *
	 * @covers ::find_all_by_post_id
	 *
	 * @return void
	 */
	public function test_find_all_by_post_id_with_result() {

		$post_id = 110;

		$result = $this->instance->find_all_by_post_id( $post_id );

		$this->assertIsArray( $result, 'The result should be an array.' );
		$this->assertContainsOnlyInstancesOf(
			SEO_Links::class,
			$result,
			'The result should only contain SEO_Links instances.'
		);

		$this->assertCount( 1, $result, 'The result should contain 1 items.' );

		$this->assertEquals( 'https://example.com/test', $result[0]->url, 'The url should be the same for first link.' );
		$this->assertEquals( 'internal', $result[0]->type, 'The type should be the same  for first link.' );
		$this->assertEquals( '101', $result[0]->indexable_id, 'The indexable_id should be the same for first link.' );
		$this->assertEquals( '110', $result[0]->post_id, 'The post_id should be the same for first link.' );
	}

	/**
	 * Tests the insert_many method.
	 *
	 * @covers ::insert_many
	 *
	 * @return void
	 */
	public function test_insert_many() {
		global $wpdb;
		$post_id = 11;
		$link_1  = $this->instance->query()->create(
			[
				'url'          => 'https://example.com/test1',
				'type'         => 'external',
				'indexable_id' => 1,
				'post_id'      => $post_id,
			]
		);
		$link_2  = $this->instance->query()->create(
			[
				'url'          => 'https://example.com/test2',
				'type'         => 'internal',
				'indexable_id' => 2,
				'post_id'      => $post_id,
			]
		);

		$links = [ $link_1, $link_2 ];

		$this->instance->insert_many( $links );

		$result = $wpdb->get_results(
			$wpdb->prepare( "SELECT * FROM {$wpdb->prefix}yoast_seo_links WHERE post_id = %d", $post_id )
		);

		$this->assertCount( 2, $result, 'The result should contain 2 items.' );

		$this->assertEquals( $links[0]->url, $result[0]->url, 'The url should be the same for first link.' );
		$this->assertEquals( $links[0]->type, $result[0]->type, 'The type should be the same  for first link.' );
		$this->assertEquals( $links[0]->indexable_id, $result[0]->indexable_id, 'The indexable_id should be the same for first link.' );
		$this->assertEquals( $links[0]->post_id, $result[0]->post_id, 'The post_id should be the same for first link.' );

		$this->assertEquals( $links[1]->url, $result[1]->url, 'The url should be the same for second link.' );
		$this->assertEquals( $links[1]->type, $result[1]->type, 'The type should be the same for second link.' );
		$this->assertEquals( $links[1]->indexable_id, $result[1]->indexable_id, 'The indexable_id should be the same for second link.' );
		$this->assertEquals( $links[1]->post_id, $result[1]->post_id, 'The post_id should be the same for second link.' );

		$this->assertIsArray( $result, 'The result should be an array.' );
	}

	/**
	 * Tests the find_all_by_indexable_id method.
	 *
	 * @covers ::find_all_by_indexable_id
	 *
	 * @return void
	 */
	public function test_find_all_by_indexable_id_no_results_found() {
		$result = $this->instance->find_all_by_indexable_id( 3 );

		$this->assertIsArray( $result, 'The result should be an array when there are no result.' );
		$this->assertEmpty( $result, 'The result should be empty.' );
	}

	/**
	 * Tests the find_all_by_indexable_id method.
	 *
	 * @covers ::find_all_by_indexable_id
	 *
	 * @return void
	 */
	public function test_find_all_by_indexable_id_with_results_found() {

		$result = $this->instance->find_all_by_indexable_id( 101 );

		$this->assertIsArray( $result, 'The result should be an array.' );

		$this->assertCount( 1, $result, 'The result should contain one item.' );
	}

	/**
	 * Tests find_one_by_url method.
	 *
	 * @covers ::find_one_by_url
	 *
	 * @return void
	 */
	public function test_find_one_by_url() {

		$result = $this->instance->find_one_by_url( 'https://example.com/test' );

		$this->assertInstanceOf( SEO_Links::class, $result, 'The result should SEO_Links type.' );
		$this->assertSame( $result->target_post_id, 112, 'The target_post_id should be 112.' );
	}

	/**
	 * Tests find_all_by_target_post_id.
	 *
	 * @covers ::find_all_by_target_post_id
	 *
	 * @return void
	 */
	public function test_find_all_by_target_post_id() {
		$result = $this->instance->find_all_by_target_post_id( '112' );

		$this->assertIsArray( $result, 'The result should be an array.' );

		$this->assertContainsOnlyInstancesOf(
			SEO_Links::class,
			$result,
			'The result should only contain SEO_Links instances.'
		);

		$this->assertCount( 1, $result, 'The result should contain one item.' );
	}

	/**
	 * Data provider for test_update_target_indexable_id.
	 *
	 * @return array
	 */
	public static function data_provider_test_update_target_indexable_id() {
		return [
			'The update should be succesful, with no change' => [
				'link_id'             => 113,
				'target_indexable_id' => '112',
				'expected_result'     => true,
				'in_db'               => 1,
			],
			'The update should be succesful with update' => [
				'link_id'             => 113,
				'target_indexable_id' => '155',
				'expected_result'     => true,
				'in_db'               => 1,
			],
			'No update, id is invalid' => [
				'link_id'             => 115,
				'target_indexable_id' => 112,
				'expected_result'     => false,
				'in_db'               => 0,
			],
		];
	}

	/**
	 * Tests update_target_indexable_id.
	 *
	 * @covers ::update_target_indexable_id
	 *
	 * @dataProvider data_provider_test_update_target_indexable_id
	 *
	 * @param int  $link_id             The link id.
	 * @param int  $target_indexable_id The target indexable id to update.
	 * @param bool $expected_result     The expected result.
	 * @param int  $in_db               The expected result in the database.
	 *
	 * @return void
	 */
	public function test_update_target_indexable_id( $link_id, $target_indexable_id, $expected_result, $in_db ) {
		global $wpdb;
		$result = $this->instance->update_target_indexable_id( $link_id, $target_indexable_id );

		$this->assertSame( $expected_result, $result );

		$db = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM `' . $wpdb->prefix . 'yoast_seo_links` WHERE `id` = %d AND `target_indexable_id` = %d', [ $link_id, $target_indexable_id ] ) );

		$this->assertEquals( $in_db, $db, 'The result should be the same in the database.' );
	}

	/**
	 * Data provider for test_delete_all_by_post_id.
	 *
	 * @return array
	 */
	public static function data_provider_test_delete_all_by_post_id() {
		return [
			'The delete should be succesful' => [
				'post_id'         => 110,
				'expected_result' => 2,
			],
			'The delete should fail, no post id' => [
				'post_id'         => 111,
				'expected_result' => 0,
			],
		];
	}

	/**
	 * Tests delete_all_by_post_id.
	 *
	 * @covers ::delete_all_by_post_id
	 *
	 * @dataProvider data_provider_test_delete_all_by_post_id
	 *
	 * @param int $post_id         The post id.
	 * @param int $expected_result The expected result.
	 *
	 * @return void
	 */
	public function test_delete_all_by_post_id( $post_id, $expected_result ) {
		global $wpdb;

		// Adding another link with indexable_id null.
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'            => 'https://example.com/test/1',
				'type'           => 'internal',
				'indexable_id'   => '101',
				'post_id'        => '110',
				'target_post_id' => '159',
				'id'             => '223',
			]
		);

		$result = $this->instance->delete_all_by_post_id( $post_id );

		$db = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM `' . $wpdb->prefix . 'yoast_seo_links` WHERE `post_id`=%d', $post_id ) );

		$this->assertEquals( 0, $db, 'The result should be the same in the database.' );

		$this->assertSame( $expected_result, $result, 'How many links were deleted should be the result' );
	}

	/**
	 * Data provider for test test_delete_all_by_post_id_where_indexable_id_null
	 *
	 * @return array
	 */
	public static function data_provider_test_delete_all_by_post_id_where_indexable_id_null() {
		return [
			'The delete should be succesful' => [
				'post_id'         => 110,
				'expected_result' => 2,
			],
			'The delete should fail, no post id' => [
				'post_id'         => 111,
				'expected_result' => 0,
			],
		];
	}

	/**
	 * Tests delete_all_by_post_id_where_indexable_id_null.
	 *
	 * @covers ::delete_all_by_post_id_where_indexable_id_null
	 *
	 * @dataProvider data_provider_test_delete_all_by_post_id_where_indexable_id_null
	 *
	 * @param int $post_id         The post id.
	 * @param int $expected_result The number of links deleted.
	 *
	 * @return void
	 */
	public function test_delete_all_by_post_id_where_indexable_id_null( $post_id, $expected_result ) {
		global $wpdb;

		// Adding another link with indexable_id null.
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'            => 'https://example.com/test/1',
				'type'           => 'internal',
				'indexable_id'   => null,
				'post_id'        => '110',
				'target_post_id' => '154',
				'id'             => '222',
			]
		);
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'            => 'https://example.com/test/2',
				'type'           => 'internal',
				'indexable_id'   => null,
				'post_id'        => '110',
				'target_post_id' => '159',
				'id'             => '229',
			]
		);

		$result = $this->instance->delete_all_by_post_id_where_indexable_id_null( $post_id );

		$db = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM `' . $wpdb->prefix . 'yoast_seo_links` WHERE `post_id`=%d AND `indexable_id` IS NULL', $post_id ) );

		$this->assertEquals( 0, $db, 'The result should be the same in the database.' );

		$this->assertSame( $expected_result, $result, 'How many links were deleted should be the result' );
	}

	/**
	 * Data provider for test test_delete_all_by_indexable_id
	 *
	 * @return array
	 */
	public static function data_provider_test_delete_all_by_indexable_id() {
		return [
			'The delete should be succesful' => [
				'indexable_id'    => 101,
				'expected_result' => 2,
			],
			'The delete should fail, no indexable id' => [
				'indexable_id'    => 999,
				'expected_result' => 0,
			],
		];
	}

	/**
	 * Tests delete_all_by_indexable_id.
	 *
	 * @covers ::delete_all_by_indexable_id
	 *
	 * @dataProvider data_provider_test_delete_all_by_indexable_id
	 *
	 * @param int $indexable_id    The indexable id.
	 * @param int $expected_result The number of links deleted.
	 *
	 * @return void
	 */
	public function test_delete_all_by_indexable_id( $indexable_id, $expected_result ) {
		global $wpdb;
		// Adding another link with same indexable_id.
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'            => 'https://example.com/test/1',
				'type'           => 'internal',
				'indexable_id'   => '101',
				'post_id'        => '110',
				'target_post_id' => '154',
				'id'             => '222',
			]
		);

		$result = $this->instance->delete_all_by_indexable_id( $indexable_id );

		$db = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM `' . $wpdb->prefix . 'yoast_seo_links` WHERE `indexable_id`=%d', $indexable_id ) );

		$this->assertEquals( 0, $db, 'The result should be the same in the database.' );

		$this->assertSame( $expected_result, $result, 'How many links were deleted should be the result' );
	}

	/**
	 * Data provider for get_incoming_link_counts_for_post_ids
	 *
	 * @return array
	 */
	public static function data_provider_get_incoming_link_counts_for_post_ids() {
		return [
			'One item in post_ids array with result' => [
				'post_ids'        => [ 154 ],
				'expected_result' => [
					[
						'incoming' => '1',
						'post_id'  => '154',
					],
				],
			],
			'One item in post_ids array without result' => [
				'post_ids'        => [ 100 ],
				'expected_result' => [],
			],
			'Two items in post_ids array with result' => [
				'post_ids'        => [ 112, 154 ],
				'expected_result' => [
					[
						'incoming' => '1',
						'post_id'  => '112',
					],
					[
						'incoming' => '1',
						'post_id'  => '154',
					],
				],
			],
		];
	}

	/**
	 * Tests get_incoming_link_counts_for_post_ids.
	 *
	 * @covers ::get_incoming_link_counts_for_post_ids
	 *
	 * @dataProvider data_provider_get_incoming_link_counts_for_post_ids
	 *
	 * @param array $post_ids        The post ids.
	 * @param array $expected_result The expected result.
	 *
	 * @return void
	 */
	public function test_get_incoming_link_counts_for_post_ids( $post_ids, $expected_result ) {
		global $wpdb;
		// Adding another link with same indexable_id.
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'            => 'https://example.com/test/1',
				'type'           => 'internal',
				'indexable_id'   => '101',
				'post_id'        => '108',
				'target_post_id' => '154',
				'id'             => '222',
			]
		);

		$result = $this->instance->get_incoming_link_counts_for_post_ids( $post_ids );

		$this->assertSame( $expected_result, $result, 'The result should be the same' );
	}

	/**
	 * Data provider for test_delete_many_by_id
	 *
	 * @return array
	 */
	public static function data_provider_test_delete_many_by_id() {
		return [
			'The delete should be succesful' => [
				'ids'             => [ 222, 113 ],
				'expected_result' => 2,
			],
			'The delete should fail, no ids' => [
				'ids'             => [ 999 ],
				'expected_result' => 0,
			],
		];
	}

	/**
	 * Tests delete_many_by_id
	 *
	 * @covers ::delete_many_by_id
	 *
	 * @dataProvider data_provider_test_delete_many_by_id
	 *
	 * @param array $ids             The ids.
	 * @param int   $expected_result The number of links deleted.
	 *
	 * @return void
	 */
	public function test_delete_many_by_id( $ids, $expected_result ) {
		global $wpdb;
		// Adding another link.
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'            => 'https://example.com/test/1',
				'type'           => 'internal',
				'indexable_id'   => '101',
				'post_id'        => '108',
				'target_post_id' => '154',
				'id'             => '222',
			]
		);

		$result = $this->instance->delete_many_by_id( $ids );

		$in = \implode( ',', $ids );

		$db = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM `' . $wpdb->prefix . 'yoast_seo_links` WHERE `id`IN (%s)', $in ) );

		$this->assertEquals( 0, $db, 'The result should be the same in the database.' );

		$this->assertSame( $expected_result, $result, 'How many links were deleted should be the result' );
	}

	/**
	 * Data provider for test_get_incoming_link_counts_for_indexable_ids
	 *
	 * @return array
	 */
	public static function data_provider_test_get_incoming_link_counts_for_indexable_ids() {
		return [
			'One target indexable id' => [
				'indexable_ids'   => [ 355 ],
				'expected_result' => [
					[
						'incoming'            => '1',
						'target_indexable_id' => '355',
					],
				],
			],
			'No target indexable ids' => [
				'indexable_ids'   => [ 102 ],
				'expected_result' => [
					[
						'incoming'            => '0',
						'target_indexable_id' => '102',
					],
				],
			],
			'The Result should have two arrays' => [
				'indexable_ids'   => [ 344, 355 ],
				'expected_result' => [
					[
						'incoming'            => '1',
						'target_indexable_id' => '344',
					],
					[
						'incoming'            => '1',
						'target_indexable_id' => '355',
					],
				],
			],
			'Query fails' => [
				'indexable_ids'   => [],
				'expected_result' => [],
			],
		];
	}

	/**
	 * Tests get_incoming_link_counts_for_indexable_ids
	 *
	 * @covers ::get_incoming_link_counts_for_indexable_ids
	 *
	 * @dataProvider data_provider_test_get_incoming_link_counts_for_indexable_ids
	 *
	 * @param array $indexable_ids   The indexable ids.
	 * @param array $expected_result The expected result.
	 *
	 * @return void
	 */
	public function test_get_incoming_link_counts_for_indexable_ids( $indexable_ids, $expected_result ) {
		global $wpdb;
		// Adding another link with same indexable_id.
		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'                 => 'https://example.com/test/1',
				'type'                => 'internal',
				'indexable_id'        => '102',
				'post_id'             => '108',
				'target_post_id'      => '154',
				'id'                  => '222',
				'target_indexable_id' => '355',
			]
		);

		$result = $this->instance->get_incoming_link_counts_for_indexable_ids( $indexable_ids );

		$this->assertSame( $expected_result, $result, 'The result should be the same' );
	}
}
