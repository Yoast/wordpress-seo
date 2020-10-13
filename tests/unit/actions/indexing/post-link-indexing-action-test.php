<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Post_Link_Indexing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action
 */
class Post_Link_Indexing_Action_Test extends TestCase {

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * The instance.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->link_builder     = Mockery::mock( Indexable_Link_Builder::class );
		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->repository       = Mockery::mock( Indexable_Repository::class );
		$this->wpdb             = Mockery::mock( 'wpdb' );
		$this->wpdb->posts      = 'wp_posts';

		$this->instance = new Post_Link_Indexing_Action(
			$this->link_builder,
			$this->repository,
			$this->wpdb
		);
		$this->instance->set_helper( $this->post_type_helper );
	}

	/**
	 * Tests getting the total unindexed.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$empty_string   = '';
		$expected_query = "SELECT COUNT(ID)
			FROM wp_posts
			WHERE ID NOT IN (
				SELECT object_id FROM wp_yoast_indexable WHERE link_count IS NOT NULL AND object_type = 'post'
			) AND post_status = 'publish' AND post_type IN (%s, %s)
			$empty_string
			";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'post', 'page' ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'query' )
			->andReturn( '10' );

		Functions\expect( 'set_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT, '10', \DAY_IN_SECONDS )
			->andReturn( true );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests getting the total unindexed.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed_cached() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( '25' );

		$this->assertEquals( 25, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests getting the total unindexed.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed_failed_query() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$empty_string   = '';
		$expected_query = "SELECT COUNT(ID)
			FROM wp_posts
			WHERE ID NOT IN (
				SELECT object_id FROM wp_yoast_indexable WHERE link_count IS NOT NULL AND object_type = 'post'
			) AND post_status = 'publish' AND post_type IN (%s, %s)
			$empty_string
			";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'post', 'page' ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'query' )
			->andReturn( null );

		$this->assertFalse( $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index function.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 */
	public function test_index() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "SELECT ID, post_content
			FROM wp_posts
			WHERE ID NOT IN (
				SELECT object_id FROM wp_yoast_indexable WHERE link_count IS NOT NULL AND object_type = 'post'
			) AND post_status = 'publish' AND post_type IN (%s, %s)
			LIMIT %d
			";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'post', 'page', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn(
				[
					(object) [
						'ID'           => 1,
						'post_content' => 'foo',
					],
					(object) [
						'ID'           => 3,
						'post_content' => 'foo',
					],
					(object) [
						'ID'           => 8,
						'post_content' => 'foo',
					],
				]
			);

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( (object) [ 'link_count' => 10 ] );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' )->andReturn( (object) [ 'link_count' => 10 ] );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' )->andReturn( (object) [ 'link_count' => 10 ] );

		Functions\expect( 'delete_transient' )->once()->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT );

		$this->instance->index();
	}

	/**
	 * Tests the index function.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 */
	public function test_index_without_link_count() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "SELECT ID, post_content
			FROM wp_posts
			WHERE ID NOT IN (
				SELECT object_id FROM wp_yoast_indexable WHERE link_count IS NOT NULL AND object_type = 'post'
			) AND post_status = 'publish' AND post_type IN (%s, %s)
			LIMIT %d
			";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'post', 'page', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn(
				[
					(object) [
						'ID'           => 1,
						'post_content' => 'foo',
					],
					(object) [
						'ID'           => 3,
						'post_content' => 'foo',
					],
					(object) [
						'ID'           => 8,
						'post_content' => 'foo',
					],
				]
			);

		$indexable             = Mockery::mock( Indexable_Mock::class );
		$indexable->link_count = null;
		$indexable->expects( 'save' )->times( 3 );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $indexable );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'post' )->andReturn( $indexable );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'post' )->andReturn( $indexable );
		$this->link_builder->expects( 'build' )->times( 3 )->with( $indexable, 'foo' );

		Functions\expect( 'delete_transient' )->once()->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT );

		$this->instance->index();
	}
}
