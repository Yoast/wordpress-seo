<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Mockery;
use wpdb;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * The ORM Mock.
	 *
	 * @var Mockery\MockInterface|ORM
	 */
	private $orm_mock;

	/**
	 * The wpdb mock.
	 *
	 * @var wpdb|Mockery\MockInterface
	 */
	protected $wpdb;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->orm_mock = Mockery::mock( ORM::class );

		$this->instance = $this
			->getMockBuilder( SEO_Links_Repository::class )
			->setMethods( [ 'query' ] )
			->getMock();
	}

	/**
	 * Tests the query method.
	 *
	 * @covers ::query
	 *
	 * @return void
	 */
	public function test_query() {
		$seo_links_repository = new SEO_Links_Repository();

		$this->assertInstanceOf( ORM::class, $seo_links_repository->query() );
	}

	/**
	 * Tests the find_all_by_post_id method.
	 *
	 * @covers ::find_all_by_post_id
	 *
	 * @return void
	 */
	public function test_find_all_by_post_id() {
		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$post_id         = 1;
		$expected_result = [ new SEO_Links(), new SEO_Links() ];

		$this->orm_mock->shouldReceive( 'where' )->with( 'post_id', $post_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'find_many' )->andReturn( $expected_result );

		$this->instance->find_all_by_post_id( $post_id );
	}

	/**
	 * Tests the find_all_by_indexable_id method.
	 *
	 * @covers ::find_all_by_indexable_id
	 *
	 * @return void
	 */
	public function test_find_all_by_indexable_id() {
		$indexable_id    = 1;
		$expected_result = [ new SEO_Links(), new SEO_Links() ];

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'where' )->with( 'indexable_id', $indexable_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'find_many' )->andReturn( $expected_result );

		$this->instance->find_all_by_indexable_id( $indexable_id );
	}

	/**
	 * Tests the find_one_by_url method.
	 *
	 * @covers ::find_one_by_url
	 *
	 * @return void
	 */
	public function test_find_one_by_url() {
		$url             = 'https://example.com';
		$expected_result = new SEO_Links();

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'select' )->with( 'target_post_id' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'where' )->with( 'url', $url )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'find_one' )->andReturn( $expected_result );

		$this->instance->find_one_by_url( $url );
	}

	/**
	 * Tests the find_all_by_target_post_id.
	 *
	 * @covers ::find_all_by_target_post_id
	 *
	 * @return void
	 */
	public function test_find_all_by_target_post_id() {
		$target_post_id  = 5;
		$expected_result = [ new SEO_Links(), new SEO_Links() ];

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'where' )->with( 'target_post_id', $target_post_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'find_many' )->andReturn( $expected_result );

		$this->instance->find_all_by_target_post_id( $target_post_id );
	}

	/**
	 * Tests the update_target_indexable_id method.
	 *
	 * @covers ::update_target_indexable_id
	 *
	 * @return void
	 */
	public function test_update_target_indexable_id() {
		$link_id             = 1;
		$target_indexable_id = 2;

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'set' )->with( 'target_indexable_id', $target_indexable_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'where' )->with( 'id', $link_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'update_many' )->andReturn( 1 );

		$this->assertTrue( $this->instance->update_target_indexable_id( $link_id, $target_indexable_id ) );
	}

	/**
	 * Tests the delete_all_by_post_id method.
	 *
	 * @covers ::delete_all_by_post_id
	 *
	 * @return void
	 */
	public function test_delete_all_by_post_id() {
		$post_id = 1;

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'where' )->with( 'post_id', $post_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'delete_many' )->andReturn( true );

		$this->instance->delete_all_by_post_id( $post_id );
	}

	/**
	 * Tests the delete_all_by_post_id_where_indexable_id_null method.
	 *
	 * @covers ::delete_all_by_post_id_where_indexable_id_null
	 *
	 * @return void
	 */
	public function test_delete_all_by_post_id_where_indexable_id_null() {
		$post_id = 1;

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'where' )->with( 'post_id', $post_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'where_null' )->with( 'indexable_id' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'delete_many' )->andReturn( true );

		$this->instance->delete_all_by_post_id_where_indexable_id_null( $post_id );
	}

	/**
	 * Tests the delete_all_by_indexable_id method.
	 *
	 * @covers ::delete_all_by_indexable_id
	 *
	 * @return void
	 */
	public function test_delete_all_by_indexable_id() {
		$indexable_id = 1;

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'where' )->with( 'indexable_id', $indexable_id )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'delete_many' )->andReturn( true );

		$this->instance->delete_all_by_indexable_id( $indexable_id );
	}

	/**
	 * Tests the get_incoming_link_counts_for_post_ids method.
	 *
	 * @covers ::get_incoming_link_counts_for_post_ids
	 *
	 * @return void
	 */
	public function test_get_incoming_link_counts_for_post_ids() {
		$post_ids        = [ 1, 2 ];
		$expected_result = [
			[
				'post_id'  => 1,
				'incoming' => 2,
			],
			[
				'post_id'  => 2,
				'incoming' => 1,
			],
		];

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'select_expr' )->with( 'COUNT( id )', 'incoming' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'select' )->with( 'target_post_id', 'post_id' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'where_in' )->with( 'target_post_id', $post_ids )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'group_by' )->with( 'target_post_id' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'find_array' )->andReturn( $expected_result );

		$this->instance->get_incoming_link_counts_for_post_ids( $post_ids );
	}

	/**
	 * Data provider for test_get_incoming_link_counts_for_indexable_ids method.
	 *
	 * @return array
	 */
	public static function get_incoming_link_counts_for_indexable_ids_provider() {
		return [
			'Indexable counts is false' => [
				'indexable_counts' => false,
				'expected_return'  => [],
			],
			'Indexable count is empty array' => [
				'indexable_counts' => [],
				'expected_return'  => [
					[
						'incoming'            => '0',
						'target_indexable_id' => '1',

					],
					[
						'incoming'            => '0',
						'target_indexable_id' => '2',

					],
				],
			],
			'Indexable count is array of arrays with target_ondexable_id' => [
				'indexable_counts' => [
					[ 'target_indexable_id' => '1' ],
					[ 'target_indexable_id' => '2' ],
				],
				'expected_return' => [
					[ 'target_indexable_id' => '1' ],
					[ 'target_indexable_id' => '2' ],
				],
			],
		];
	}

	/**
	 * Tests the get_incoming_link_counts_for_indexable_ids method.
	 *
	 * @covers ::get_incoming_link_counts_for_indexable_ids
	 *
	 * @dataProvider get_incoming_link_counts_for_indexable_ids_provider
	 * @param array $indexable_counts The indexable counts.
	 * @param array $expected         The expected result.
	 *
	 * @return void
	 */
	public function test_get_incoming_link_counts_for_indexable_ids( $indexable_counts, $expected ) {
		$indexable_ids = [ 1, 2 ];

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'select_expr' )->with( 'COUNT( id )', 'incoming' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'select' )->with( 'target_indexable_id' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'where_in' )->with( 'target_indexable_id', $indexable_ids )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'group_by' )->with( 'target_indexable_id' )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'find_array' )->andReturn( $indexable_counts );

		$this->assertSame( $expected, $this->instance->get_incoming_link_counts_for_indexable_ids( $indexable_ids ) );
	}

	/**
	 * Tests the delete_many_by_id.
	 *
	 * @covers ::delete_many_by_id
	 *
	 * @return void
	 */
	public function test_delete_many_by_id() {
		$ids = [ 1, 2 ];

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'where_in' )->with( 'id', $ids )->andReturn( $this->orm_mock );
		$this->orm_mock->shouldReceive( 'delete_many' )->andReturn( true );

		$this->instance->delete_many_by_id( $ids );
	}

	/**
	 * Tests the insert_many method.
	 *
	 * @covers ::insert_many
	 *
	 * @return void
	 */
	public function test_insert_many() {
		$links = [ new SEO_Links(), new SEO_Links() ];

		$this->instance->expects( $this->once() )
			->method( 'query' )
			->willReturn( $this->orm_mock );

		$this->orm_mock->shouldReceive( 'insert_many' )->with( $links )->andReturn( true );

		$this->instance->insert_many( $links );
	}
}
