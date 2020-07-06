<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Repositories
 */

namespace Yoast\WP\SEO\Tests\Repositories;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

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
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->builder              = Mockery::mock( Indexable_Builder::class );
		$this->current_page         = Mockery::mock( Current_Page_Helper::class );
		$this->logger               = Mockery::mock( Logger::class );
		$this->hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->instance             = Mockery::mock(
			Indexable_Repository::class,
			[
				$this->builder,
				$this->current_page,
				$this->logger,
				$this->hierarchy_repository,
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

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests that retrieving the ancestors of an indexable ensures
	 * that the permalink of each ancestor is available.
	 */
	public function test_get_ancestors_ensures_permalink() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$indexable->expects( 'save' )->once();
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1, 2 ] );

		$orm_object = $this->mock_orm( [ 1, 2 ], [ $indexable ] );

		$permalink = 'https://example.org/permalink';

		Monkey\Functions\expect( 'get_permalink' )
			->andReturn( $permalink );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertEquals( $permalink, $indexable->permalink );
	}

	/**
	 * Tests that ensure permalink does not save when the permalink is still null.
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

		Monkey\Functions\expect( 'get_permalink' )
			->andReturnNull();

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertNull( $indexable->permalink );
	}

	/**
	 * Tests that retrieving the ancestors of an indexable ensures
	 * that the permalink of each ancestor is available when there is only one ancestor.
	 */
	public function test_get_ancestors_one_ancestor_ensures_permalink() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$indexable->expects( 'save' )->once();
		$indexable->object_type = 'post';

		$this->hierarchy_repository
			->expects( 'find_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$orm_object = $this->mock_orm( [ 1 ], [ $indexable ] );

		$permalink = 'https://example.org/permalink';

		Monkey\Functions\expect( 'get_permalink' )
			->andReturn( $permalink );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
		$this->assertEquals( $permalink, $indexable->permalink );
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

		$this->assertAttributeEquals( '\Yoast\WP\SEO\Models\Indexable', 'class_name', $query );
		$this->assertInstanceOf( ORM::class, $query );
	}
}
