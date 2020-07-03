<?php

namespace Yoast\WP\SEO\Tests\Actions\Indexation;

use Brain\Monkey\Functions;
use Brain\Monkey\Filters;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Indexable_Post_Indexation_Action_Test class
 *
 * @group actions
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action
 */
class Indexable_Post_Indexation_Action_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type_helper;

	/**
	 * The builder mock.
	 *
	 * @var Indexable_Repository|Mockery\MockInterface
	 */
	protected $repository;

	/**
	 * The wpdb mock.
	 *
	 * @var wpdb|Mockery\MockInterface
	 */
	protected $wpdb;

	/**
	 * The instance.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->repository       = Mockery::mock( Indexable_Repository::class );
		$this->wpdb             = Mockery::mock( 'wpdb' );
		$this->wpdb->posts      = 'wp_posts';

		$this->instance = new Indexable_Post_Indexation_Action(
			$this->post_type_helper,
			$this->repository,
			$this->wpdb
		);
	}

	/**
	 * Tests the get total unindexed method.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_query
	 */
	public function test_get_total_unindexed() {
		$limit_placeholder = '';
		$expected_query    = "
			SELECT COUNT(ID)
			FROM wp_posts
			WHERE ID NOT IN (
				SELECT object_id
				FROM wp_yoast_indexable
				WHERE object_type = 'post'
			)
			AND post_type IN (%s)
			$limit_placeholder";

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_posts' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_posts', '10', \DAY_IN_SECONDS )->andReturnTrue();
		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'public_post_type' ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get total unindexed method with cache.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_query
	 */
	public function test_get_total_unindexed_cached() {
		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_posts' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get total unindexed method when the query fails.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed_failed_query() {
		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_posts' )->andReturnFalse();

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( null );

		$this->assertFalse( $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index method.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_query
	 * @covers ::get_limit
	 */
	public function test_index() {
		$expected_query = '
			SELECT ID
			FROM wp_posts
			WHERE ID NOT IN (
				SELECT object_id
				FROM wp_yoast_indexable
				WHERE object_type = \'post\'
			)
			AND post_type IN (%s)
			LIMIT %d';

		Filters\expectApplied( 'wpseo_post_indexation_limit' )->andReturn( 25 );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->wpdb->expects( 'prepare' )->once()->with( $expected_query, [ 'public_post_type', 25 ] )->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts' );

		$this->instance->index();
	}

	/**
	 * Tests the filter fallback when not returning an integer.
	 *
	 * @covers ::index
	 * @covers ::get_limit
	 */
	public function test_index_with_limit_filter_no_int() {
		Filters\expectApplied( 'wpseo_post_indexation_limit' )->andReturn( 'not an integer' );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts' );

		$this->instance->index();
	}
}
