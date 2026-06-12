<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Repository
 *
 * @group indexables
 * @group repositories
 */
final class Indexable_Repository_Test extends TestCase {

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	protected $builder;

	/**
	 * Represents the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * Represents the logger.
	 *
	 * @var Mockery\MockInterface|Logger
	 */
	protected $logger;

	/**
	 * Represents the indexable hierarchy repository.
	 *
	 * @var Mockery\Mock|Indexable_Hierarchy_Repository
	 */
	protected $hierarchy_repository;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Repository
	 */
	protected $instance;

	/**
	 * Represents the WordPress database.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Represents the Version Manager.
	 *
	 * @var Mockery\Mock|Indexable_Version_Manager
	 */
	protected $version_manager;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->builder              = Mockery::mock( Indexable_Builder::class );
		$this->current_page         = Mockery::mock( Current_Page_Helper::class );
		$this->logger               = Mockery::mock( Logger::class );
		$this->hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->wpdb                 = Mockery::mock( wpdb::class );
		$this->version_manager      = Mockery::mock( Indexable_Version_Manager::class );
		$this->instance             = Mockery::mock(
			Indexable_Repository::class,
			[
				$this->builder,
				$this->current_page,
				$this->logger,
				$this->hierarchy_repository,
				$this->wpdb,
				$this->version_manager,
			],
		)->makePartial();
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_no_ancestors_found() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [] );

		$this->assertSame( [], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with one ancestor with no ancestor id found.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_one_ancestor_that_has_no_ancestor_id_found() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 9 ] );

		$orm_object = $this->mock_orm( [ 9 ], [] );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with one found ancestor.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_one_ancestor_that_has_ancestor_id_found() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink = 'https://example.org/post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$orm_object = $this->mock_orm( [ 1 ], [ $indexable ] );

		$this->mock_version_check( $indexable, $indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with multiple ancestors found.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_with_multiple_ancestors() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink = 'https://example.org/post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$this->mock_version_check( $indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests that retrieving the ancestors of an indexable ensures
	 * that the permalink of each ancestor is available.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_checks_version() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$permalink = 'https://example.org/permalink';

		$resulting_indexable            = Mockery::mock( Indexable_Mock::class );
		$resulting_indexable->permalink = $permalink;

		$this->mock_version_check( $indexable, $resulting_indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $resulting_indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertEquals( $permalink, $resulting_indexable->permalink );
	}

	/**
	 * Tests that ensure permalink does not save when the permalink is still null.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_ensures_permalink_no_save() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$indexable->expects( 'save' )->never();
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->mock_version_check( $indexable );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertNull( $indexable->permalink );
	}

	/**
	 * Tests that retrieving the ancestors of an indexable ensures
	 * that the permalink of each ancestor is available when there is only one ancestor.
	 *
	 * @covers ::get_ancestors
	 *
	 * @return void
	 */
	public function test_get_ancestors_one_ancestor_ensures_permalink() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$indexable->expects( 'save' )->never();
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$orm_object = $this->mock_orm( [ 1 ], [ $indexable ] );

		$permalink = 'https://example.org/permalink';

		$resulting_indexable            = Mockery::mock( Indexable_Mock::class );
		$resulting_indexable->permalink = $permalink;

		$this->mock_version_check( $indexable, $resulting_indexable );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $resulting_indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertEquals( $permalink, $resulting_indexable->permalink );
	}

	/**
	 * Mocks the ORM object.
	 *
	 * @param int[]       $indexable_ids The list of indexable IDs to expect to be retrieved.
	 * @param Indexable[] $indexables    The list of indexables to expect to be retrieved.
	 *
	 * @return Mockery\Mock The mocked ORM object.
	 */
	private function mock_orm( $indexable_ids, $indexables ) {
		$orm_object = Mockery::mock( ORM::class )->makePartial();
		$orm_object
			->expects( 'where_in' )
			->with( 'id', $indexable_ids )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'order_by_expr' )
			->with( 'FIELD(id,' . \implode( ',', $indexable_ids ) . ')' )
			->andReturn( $orm_object );
		$orm_object
			->expects( 'find_many' )
			->andReturn( $indexables );

		return $orm_object;
	}

	/**
	 * Tests if the query method returns an instance of the ORM class that
	 * represents the Indexable.
	 *
	 * @covers ::query
	 *
	 * @return void
	 */
	public function test_query() {
		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$GLOBALS['wpdb'] = $wpdb;

		$query = $this->instance->query();

		$this->assertEquals( '\Yoast\WP\SEO\Models\Indexable', $this->getPropertyValue( $query, 'class_name' ) );
		$this->assertInstanceOf( ORM::class, $query );
	}

	/**
	 * Tests retrieval of the child indexables with no children found for indexable.
	 *
	 * @covers ::find_by_ids
	 *
	 * @return void
	 */
	public function test_find_by_ids() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'where_in' )
			->with( 'id', [ 1, 2, 3 ] )
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'find_many' )
			->once()
			->andReturn( [ $indexable ] );

		$this->mock_version_check( $indexable, $indexable );

		$result = $this->instance->find_by_ids( [ 1, 2, 3 ] );

		$this->assertSame( [ $indexable ], $result );
	}

	/**
	 * Tests that no query is run when no object ids are passed.
	 *
	 * @covers ::find_by_multiple_ids_and_type
	 *
	 * @return void
	 */
	public function test_find_by_multiple_ids_and_type_with_empty_object_ids() {
		$this->instance->expects( 'query' )->never();

		$this->assertSame( [], $this->instance->find_by_multiple_ids_and_type( [], 'post' ) );
	}

	/**
	 * Tests that nothing is built or primed when all indexables already exist.
	 *
	 * @covers ::find_by_multiple_ids_and_type
	 *
	 * @return void
	 */
	public function test_find_by_multiple_ids_and_type_all_found() {
		$indexable_one            = Mockery::mock( Indexable_Mock::class );
		$indexable_one->object_id = 1;
		$indexable_two            = Mockery::mock( Indexable_Mock::class );
		$indexable_two->object_id = 2;

		$this->mock_query_for_object_ids( [ 1, 2 ], 'post', [ $indexable_one, $indexable_two ] );

		Functions\expect( '_prime_post_caches' )->never();
		$this->builder->expects( 'build_for_id_and_type' )->never();

		$this->mock_version_check( $indexable_one );
		$this->mock_version_check( $indexable_two );

		$this->assertSame(
			[ $indexable_one, $indexable_two ],
			$this->instance->find_by_multiple_ids_and_type( [ 1, 2 ], 'post' ),
		);
	}

	/**
	 * Tests that the post caches are primed once for the batch of missing posts before building.
	 *
	 * @covers ::find_by_multiple_ids_and_type
	 *
	 * @return void
	 */
	public function test_find_by_multiple_ids_and_type_creates_missing_posts() {
		$indexable_one            = Mockery::mock( Indexable_Mock::class );
		$indexable_one->object_id = 1;
		$indexable_two            = Mockery::mock( Indexable_Mock::class );
		$indexable_three          = Mockery::mock( Indexable_Mock::class );

		$this->mock_query_for_object_ids( [ 1, 2, 3 ], 'post', [ $indexable_one ] );

		// The array_diff in the method preserves the keys of the original object id array.
		Functions\expect( '_prime_post_caches' )
			->once()
			->with(
				[
					1 => 2,
					2 => 3,
				],
			);

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 2, 'post' )
			->andReturn( $indexable_two );
		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 3, 'post' )
			->andReturn( $indexable_three );

		$this->mock_version_check( $indexable_one );
		$this->mock_version_check( $indexable_two );
		$this->mock_version_check( $indexable_three );

		$this->assertSame(
			[ $indexable_one, $indexable_two, $indexable_three ],
			$this->instance->find_by_multiple_ids_and_type( [ 1, 2, 3 ], 'post' ),
		);
	}

	/**
	 * Tests that the term caches are primed once for the batch of missing terms before building.
	 *
	 * @covers ::find_by_multiple_ids_and_type
	 *
	 * @return void
	 */
	public function test_find_by_multiple_ids_and_type_creates_missing_terms() {
		$indexable_one = Mockery::mock( Indexable_Mock::class );
		$indexable_two = Mockery::mock( Indexable_Mock::class );

		$this->mock_query_for_object_ids( [ 5, 6 ], 'term', [] );

		Functions\expect( '_prime_term_caches' )
			->once()
			->with( [ 5, 6 ] );
		Functions\expect( '_prime_post_caches' )->never();

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 5, 'term' )
			->andReturn( $indexable_one );
		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 6, 'term' )
			->andReturn( $indexable_two );

		$this->mock_version_check( $indexable_one );
		$this->mock_version_check( $indexable_two );

		$this->assertSame(
			[ $indexable_one, $indexable_two ],
			$this->instance->find_by_multiple_ids_and_type( [ 5, 6 ], 'term' ),
		);
	}

	/**
	 * Tests that no caches are primed for object types other than post and term.
	 *
	 * @covers ::find_by_multiple_ids_and_type
	 *
	 * @return void
	 */
	public function test_find_by_multiple_ids_and_type_does_not_prime_other_object_types() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->mock_query_for_object_ids( [ 7 ], 'user', [] );

		Functions\expect( '_prime_post_caches' )->never();
		Functions\expect( '_prime_term_caches' )->never();

		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 7, 'user' )
			->andReturn( $indexable );

		$this->mock_version_check( $indexable );

		$this->assertSame( [ $indexable ], $this->instance->find_by_multiple_ids_and_type( [ 7 ], 'user' ) );
	}

	/**
	 * Tests that nothing is built or primed when auto create is disabled.
	 *
	 * @covers ::find_by_multiple_ids_and_type
	 *
	 * @return void
	 */
	public function test_find_by_multiple_ids_and_type_without_auto_create() {
		$indexable_one            = Mockery::mock( Indexable_Mock::class );
		$indexable_one->object_id = 1;

		$this->mock_query_for_object_ids( [ 1, 2 ], 'post', [ $indexable_one ] );

		Functions\expect( '_prime_post_caches' )->never();
		$this->builder->expects( 'build_for_id_and_type' )->never();

		$this->mock_version_check( $indexable_one );

		$this->assertSame(
			[ $indexable_one ],
			$this->instance->find_by_multiple_ids_and_type( [ 1, 2 ], 'post', false ),
		);
	}

	/**
	 * Mocks the ORM query that retrieves indexables by their object ids and type.
	 *
	 * @param int[]       $object_ids  The object ids to expect in the query.
	 * @param string      $object_type The object type to expect in the query.
	 * @param Indexable[] $indexables  The indexables the query returns.
	 *
	 * @return void
	 */
	private function mock_query_for_object_ids( $object_ids, $object_type, $indexables ) {
		$orm_object = Mockery::mock( ORM::class );

		$orm_object
			->expects( 'where_in' )
			->once()
			->with( 'object_id', $object_ids )
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->once()
			->with( 'object_type', $object_type )
			->andReturnSelf();

		$orm_object
			->expects( 'find_many' )
			->once()
			->andReturn( $indexables );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );
	}

	/**
	 * Tests if the reset_permalink method fires when no type and subtype are passed.
	 *
	 * @covers ::reset_permalink
	 *
	 * @return void
	 */
	public function test_reset_permalink() {
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'set' )
			->with(
				[
					'permalink'      => null,
					'permalink_hash' => null,
					'version'        => 0,
				],
			)
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'update_many' )
			->once()
			->andReturn( 10 );

		$this->assertSame( 10, $this->instance->reset_permalink() );
	}

	/**
	 * Tests if the reset_permalink method fires when type and subtype are passed.
	 *
	 * @covers ::reset_permalink
	 *
	 * @return void
	 */
	public function test_reset_permalink_with_args() {
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'set' )
			->with(
				[
					'permalink'      => null,
					'permalink_hash' => null,
					'version'        => 0,
				],
			)
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->with( 'object_type', 'term' )
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->with( 'object_sub_type', 'category' )
			->andReturnSelf();

		$orm_object
			->expects( 'update_many' )
			->once()
			->andReturn( 1 );

		$this->assertSame( 1, $this->instance->reset_permalink( 'term', 'category' ) );
	}

	/**
	 * Tests if the reset_permalink method fires when no type is passed, but a subtype is.
	 *
	 * @covers ::reset_permalink
	 *
	 * @return void
	 */
	public function test_reset_permalink_with_invalid_args() {
		$orm_object = Mockery::mock( ORM::class );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'set' )
			->with(
				[
					'permalink'      => null,
					'permalink_hash' => null,
					'version'        => 0,
				],
			)
			->once()
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->never();

		$orm_object
			->expects( 'update_many' )
			->once()
			->andReturn( 10 );

		$this->assertSame( 10, $this->instance->reset_permalink( null, 'category' ) );
	}

	/**
	 * Tests if ensure_permalink sets the permalink to 'unindexed' when the post_status is 'unindexed'.
	 *
	 * @covers ::upgrade_indexable
	 *
	 * @return void
	 */
	public function test_permalink_set_to_unindexed_ensure_permalink() {
		/**
		 * Mock indexable.
		 *
		 * @var Mockery\MockInterface|Indexable $indexable
		 */
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->permalink   = null;
		$indexable->post_status = 'unindexed';

		$this->mock_version_check( $indexable, $indexable );

		$indexable = $this->instance->upgrade_indexable( $indexable );

		$this->assertSame( null, $indexable->permalink );
	}

	/**
	 * Test that the indexable is rebuilt if the version check says so.
	 *
	 * @covers ::upgrade_indexable
	 *
	 * @return void
	 */
	public function test_rebuild_indexable_if_outdated() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->mock_version_check( $indexable, $indexable );

		$this->instance->upgrade_indexable( $indexable );
	}

	/**
	 * Test that the indexable is not rebuilt if the version check says not to.
	 *
	 * @covers ::upgrade_indexable
	 *
	 * @return void
	 */
	public function test_do_not_rebuild_indexable_if_up_to_date() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->mock_version_check( $indexable );

		$this->instance->upgrade_indexable( $indexable );
	}

	/**
	 * Setup a version check to steer the upgrade routine.
	 *
	 * @param Indexable      $indexable        The mocked indexable.
	 * @param Indexable|null $indexable_result The mocked indexable after the upgrade routine is run.
	 *                                         If not provided, or set to `null`, we expect the upgrade routine to not be triggered.
	 *
	 * @return void
	 */
	private function mock_version_check( $indexable, $indexable_result = null ) {
		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->with( $indexable )
			->andReturn( $indexable_result !== null );

		if ( $indexable_result ) {
			$this->builder
				->expects( 'build' )
				->once()
				->with( $indexable )
				->andReturn( $indexable_result );
		}
	}
}
