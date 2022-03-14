<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

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
class Indexable_Repository_Test extends TestCase {

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
			]
		)->makePartial();
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
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
	 * @param array $indexable_ids The list of indexable IDs to expect to be retrieved.
	 * @param array $indexables    The list of indexables to expect to be retrieved.
	 *
	 * @return Mockery\Mock The mocked ORM object.
	 */
	private function mock_orm( $indexable_ids, $indexables ) {
		$orm_object = Mockery::mock()->makePartial();
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
	 */
	public function test_query() {
		$wpdb         = Mockery::mock();
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
	 */
	public function test_find_by_ids() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';


		$orm_object = Mockery::mock();

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
	 * Tests if the reset_permalink method fires when no type and subtype are passed.
	 *
	 * @covers ::reset_permalink
	 */
	public function test_reset_permalink() {
		$orm_object = Mockery::mock();

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
				]
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
	 */
	public function test_reset_permalink_with_args() {
		$orm_object = Mockery::mock();

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
				]
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
	 */
	public function test_reset_permalink_with_invalid_args() {
		$orm_object = Mockery::mock();

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
				]
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
	 */
	public function test_permalink_set_to_unindexed_ensure_permalink() {
		/**
		 * Mock indexable.
		 *
		 * @var Mockery\MockInterface|Indexable
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
