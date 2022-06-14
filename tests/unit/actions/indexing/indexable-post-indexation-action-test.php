<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Indexable_Post_Indexation_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action
 */
class Indexable_Post_Indexation_Action_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type_helper;

	/**
	 * The post helper mock.
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	protected $post_helper;

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
	 * The version manager.
	 *
	 * @var Indexable_Builder_Versions|Mockery\MockInterface
	 */
	protected $builder_versions;

	/**
	 * The instance.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->post_helper      = Mockery::mock( Post_Helper::class );
		$this->repository       = Mockery::mock( Indexable_Repository::class );
		$this->wpdb             = Mockery::mock( 'wpdb' );
		$this->wpdb->posts      = 'wp_posts';
		$this->builder_versions = Mockery::mock( Indexable_Builder_Versions::class );

		$this->builder_versions
			->expects( 'get_latest_version_for_type' )
			->withArgs( [ 'post' ] )
			->andReturn( 2 );

		$this->instance = new Indexable_Post_Indexation_Action(
			$this->post_type_helper,
			$this->repository,
			$this->wpdb,
			$this->builder_versions,
			$this->post_helper
		);
	}

	/**
	 * Tests the get total unindexed method.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_count_query
	 * @covers ::get_post_types
	 */
	public function test_get_total_unindexed() {
		$expected_query = "
			SELECT COUNT(P.ID)
			FROM wp_posts AS P
			WHERE P.post_type IN (%s)
			AND P.post_status NOT IN (%s)
			AND P.ID not in (
				SELECT I.object_id from wp_yoast_indexable as I
				WHERE I.object_type = 'post'
				AND I.version = %d )";

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_posts' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_posts', '10', \DAY_IN_SECONDS )->andReturnTrue();

		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'public_post_type', 'auto-draft', 2 ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( '10' );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->post_type_helper->expects( 'get_excluded_post_types_for_indexables' )->once()->andReturn( [] );
		$this->post_helper->expects( 'get_excluded_post_statuses' )->once()->andReturn( [ 'auto-draft' ] );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get_limited_unindexed_count method with a limit.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_types
	 * @covers ::get_select_query
	 */
	public function test_get_limited_unindexed_count() {
		$limit          = 25;
		$expected_query = "
			SELECT P.ID
			FROM wp_posts AS P
			WHERE P.post_type IN (%s)
			AND P.post_status NOT IN (%s)
			AND P.ID not in (
				SELECT I.object_id from wp_yoast_indexable as I
				WHERE I.object_type = 'post'
				AND I.version = %d )
			LIMIT %d";

		$query_result = [
			'post_id_1',
			'post_id_2',
			'post_id_3',
		];

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_posts_limited' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_posts_limited', \count( $query_result ), ( \MINUTE_IN_SECONDS * 15 ) )->andReturnTrue();

		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'public_post_type', 'auto-draft', 2, $limit ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( $query_result );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->post_type_helper->expects( 'get_excluded_post_types_for_indexables' )->once()->andReturn( [] );
		$this->post_helper->expects( 'get_excluded_post_statuses' )->once()->andReturn( [ 'auto-draft' ] );

		$this->assertEquals( \count( $query_result ), $this->instance->get_limited_unindexed_count( $limit ) );
	}

	/**
	 * Tests the get total unindexed method with cache.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_post_types
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
		Functions\expect( 'set_transient' )
			->once()
			->with( 'wpseo_total_unindexed_posts', 0, ( \MINUTE_IN_SECONDS * 15 ) )
			->andReturnFalse();

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->post_type_helper->expects( 'get_excluded_post_types_for_indexables' )->once()->andReturn( [] );
		$this->post_helper->expects( 'get_excluded_post_statuses' )->once()->andReturn( [ 'auto-draft' ] );

		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( null );

		$this->assertFalse( $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests that getting the total amount of unindexed posts correctly filters
	 * out any posts from excluded post types.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_post_types
	 */
	public function test_get_total_unindexed_with_excluded_post_types() {
		$public_post_types   = [ 'public_post_type', 'excluded_post_type' ];
		$excluded_post_types = [ 'excluded_post_type' ];
		$query_params        = [ 'public_post_type', 'auto-draft', 2 ];

		$expected_query = "
			SELECT COUNT(P.ID)
			FROM wp_posts AS P
			WHERE P.post_type IN (%s)
			AND P.post_status NOT IN (%s)
			AND P.ID not in (
				SELECT I.object_id from wp_yoast_indexable as I
				WHERE I.object_type = 'post'
				AND I.version = %d )";

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_posts' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_posts', '10', \DAY_IN_SECONDS )->andReturnTrue();

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( $public_post_types );
		$this->post_type_helper->expects( 'get_excluded_post_types_for_indexables' )->once()->andReturn( $excluded_post_types );
		$this->post_helper->expects( 'get_excluded_post_statuses' )->once()->andReturn( [ 'auto-draft' ] );

		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, $query_params )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index method.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_post_types
	 */
	public function test_index() {
		$expected_query = "
			SELECT P.ID
			FROM wp_posts AS P
			WHERE P.post_type IN (%s)
			AND P.post_status NOT IN (%s)
			AND P.ID not in (
				SELECT I.object_id from wp_yoast_indexable as I
				WHERE I.object_type = 'post'
				AND I.version = %d )
			LIMIT %d";

		Filters\expectApplied( 'wpseo_post_indexation_limit' )->andReturn( 25 );

		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'public_post_type' ] );
		$this->post_type_helper
			->expects( 'get_excluded_post_types_for_indexables' )
			->once()
			->andReturn( [] );
		$this->post_helper->expects( 'get_excluded_post_statuses' )
			->once()
			->andReturn( [ 'auto-draft' ] );

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 'public_post_type', 'auto-draft', 2, 25 ]
			)
			->andReturn( 'query' );
		$this->wpdb
			->expects( 'get_col' )
			->once()
			->with( 'query' )
			->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts' );
		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts_limited' );

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
		$this->post_type_helper->expects( 'get_excluded_post_types_for_indexables' )->once()->andReturn( [] );
		$this->post_helper->expects( 'get_excluded_post_statuses' )->once()->andReturn( [ 'auto-draft' ] );

		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts' );
		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts_limited' );

		$this->instance->index();
	}

	/**
	 * Tests that posts from excluded post types do not get indexed.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_post_types
	 */
	public function test_index_with_excluded_post_types() {
		$public_post_types   = [ 'public_post_type', 'excluded_post_type' ];
		$excluded_post_types = [ 'excluded_post_type' ];

		$expected_query = "
			SELECT P.ID
			FROM wp_posts AS P
			WHERE P.post_type IN (%s)
			AND P.post_status NOT IN (%s)
			AND P.ID not in (
				SELECT I.object_id from wp_yoast_indexable as I
				WHERE I.object_type = 'post'
				AND I.version = %d )
			LIMIT %d";

		Filters\expectApplied( 'wpseo_post_indexation_limit' )->andReturn( 25 );

		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( $public_post_types );
		$this->post_type_helper
			->expects( 'get_excluded_post_types_for_indexables' )
			->once()
			->andReturn( $excluded_post_types );
		$this->post_helper
			->expects( 'get_excluded_post_statuses' )
			->once()
			->andReturn( [ 'auto-draft' ] );

		$this->wpdb->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 'public_post_type', 'auto-draft', 2, 25 ]
			)
			->andReturn( 'query' );
		$this->wpdb
			->expects( 'get_col' )
			->once()
			->with( 'query' )
			->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts' );
		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_posts_limited' );

		$this->instance->index();
	}

	/**
	 * Tests that the transients are not deleted when no indexables have been created.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_post_types
	 */
	public function test_index_no_indexables_created() {
		$expected_query = "
			SELECT P.ID
			FROM wp_posts AS P
			WHERE P.post_type IN (%s)
			AND P.post_status NOT IN (%s)
			AND P.ID not in (
				SELECT I.object_id from wp_yoast_indexable as I
				WHERE I.object_type = 'post'
				AND I.version = %d )
			LIMIT %d";

		Filters\expectApplied( 'wpseo_post_indexation_limit' )->andReturn( 25 );

		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'public_post_type' ] );
		$this->post_type_helper
			->expects( 'get_excluded_post_types_for_indexables' )
			->once()
			->andReturn( [] );
		$this->post_helper
			->expects( 'get_excluded_post_statuses' )
			->once()
			->andReturn( [ 'auto-draft' ] );

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with(
				$expected_query,
				[ 'public_post_type', 'auto-draft', 2, 25 ]
			)
			->andReturn( 'query' );
		$this->wpdb
			->expects( 'get_col' )
			->once()
			->with( 'query' )
			->andReturn( [] );

		$this->instance->index();
	}
}
