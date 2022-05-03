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
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intended, to be able to test the Abstract_Link_Indexing_Action.
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
	 * Tests setting the helper.
	 *
	 * @covers ::set_helper
	 */
	public function test_set_helper() {
		$this->instance->set_helper( Mockery::mock( Post_Type_Helper::class ) );

		static::assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
	}

	/**
	 * Tests getting the total unindexed.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		Functions\expect( 'set_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT, 0, ( \MINUTE_IN_SECONDS * 15 ) )
			->andReturn( true );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "SELECT COUNT(P.ID)
			FROM wp_posts AS P
			LEFT JOIN wp_yoast_indexable AS I
				ON P.ID = I.object_id
				AND I.link_count IS NOT NULL
				AND I.object_type = 'post'
			LEFT JOIN wp_yoast_seo_links AS L
				ON L.post_id = P.ID
				AND L.target_indexable_id IS NULL
				AND L.type = 'internal'
				AND L.target_post_id IS NOT NULL
				AND L.target_post_id != 0
			WHERE ( I.object_id IS NULL OR L.post_id IS NOT NULL )
				AND P.post_status = 'publish'
				AND P.post_type IN (%s, %s)";

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
	 * Tests getting get_limited_unindexed_count method with a limit.
	 *
	 * @covers ::get_count_query
	 * @covers ::get_total_unindexed
	 * @covers ::get_limited_unindexed_count
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::get_total_unindexed
	 */
	public function test_get_limited_unindexed_count() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		Functions\expect( 'set_transient' )
			->once()
			->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT, 0, ( \MINUTE_IN_SECONDS * 15 ) )
			->andReturn( true );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "SELECT COUNT(P.ID)
			FROM wp_posts AS P
			LEFT JOIN wp_yoast_indexable AS I
				ON P.ID = I.object_id
				AND I.link_count IS NOT NULL
				AND I.object_type = 'post'
			LEFT JOIN wp_yoast_seo_links AS L
				ON L.post_id = P.ID
				AND L.target_indexable_id IS NULL
				AND L.type = 'internal'
				AND L.target_post_id IS NOT NULL
				AND L.target_post_id != 0
			WHERE ( I.object_id IS NULL OR L.post_id IS NOT NULL )
				AND P.post_status = 'publish'
				AND P.post_type IN (%s, %s)";

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

		$this->assertFalse( $this->instance->get_limited_unindexed_count() );
	}

	/**
	 * Tests the index function.
	 *
	 * @covers ::get_objects
	 */
	public function test_index() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$posts = [
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
		];

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "
			SELECT P.ID, P.post_content
			FROM wp_posts AS P
			LEFT JOIN wp_yoast_indexable AS I
				ON P.ID = I.object_id
				AND I.link_count IS NOT NULL
				AND I.object_type = 'post'
			LEFT JOIN wp_yoast_seo_links AS L
				ON L.post_id = P.ID
				AND L.target_indexable_id IS NULL
				AND L.type = 'internal'
				AND L.target_post_id IS NOT NULL
				AND L.target_post_id != 0
			WHERE ( I.object_id IS NULL OR L.post_id IS NOT NULL )
				AND P.post_status = 'publish'
				AND P.post_type IN (%s, %s)
			LIMIT %d";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'post', 'page', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn( $posts );

		foreach ( $posts as $post ) {
			$indexable             = Mockery::mock( Indexable_Mock::class );
			$indexable->link_count = 10;
			$indexable->expects( 'save' )->once();

			$this->link_builder->expects( 'build' )->with( $indexable, $post->post_content );

			$this->repository->expects( 'find_by_id_and_type' )->once()->with( $post->ID, 'post' )->andReturn( $indexable );
		}

		Functions\expect( 'delete_transient' )->once()->with( Post_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT );

		$this->instance->index();
	}

	/**
	 * Tests the index function.
	 *
	 * @covers ::get_objects
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::index
	 */
	public function test_index_without_link_count() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "
			SELECT P.ID, P.post_content
			FROM wp_posts AS P
			LEFT JOIN wp_yoast_indexable AS I
				ON P.ID = I.object_id
				AND I.link_count IS NOT NULL
				AND I.object_type = 'post'
			LEFT JOIN wp_yoast_seo_links AS L
				ON L.post_id = P.ID
				AND L.target_indexable_id IS NULL
				AND L.type = 'internal'
				AND L.target_post_id IS NOT NULL
				AND L.target_post_id != 0
			WHERE ( I.object_id IS NULL OR L.post_id IS NOT NULL )
				AND P.post_status = 'publish'
				AND P.post_type IN (%s, %s)
			LIMIT %d";

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

	/**
	 * Tests that the transients are not deleted when no indexables have been created.
	 *
	 * @covers ::get_objects
	 */
	public function test_index_no_indexables_created() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$expected_query = "
			SELECT P.ID, P.post_content
			FROM wp_posts AS P
			LEFT JOIN wp_yoast_indexable AS I
				ON P.ID = I.object_id
				AND I.link_count IS NOT NULL
				AND I.object_type = 'post'
			LEFT JOIN wp_yoast_seo_links AS L
				ON L.post_id = P.ID
				AND L.target_indexable_id IS NULL
				AND L.type = 'internal'
				AND L.target_post_id IS NOT NULL
				AND L.target_post_id != 0
			WHERE ( I.object_id IS NULL OR L.post_id IS NOT NULL )
				AND P.post_status = 'publish'
				AND P.post_type IN (%s, %s)
			LIMIT %d";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'post', 'page', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn( [] );

		$this->instance->index();
	}
}
