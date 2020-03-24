<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters
 */

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
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
		$this->hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class )->makePartial();
		$this->instance             = Mockery::mock( Indexable_Repository::class, [
			$this->builder,
			$this->current_page,
			$this->logger,
			$this->hierarchy_repository,
		] )->makePartial();
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
	 */
	public function test_get_ancestors_no_ancestors_found() {
		$indexable = Mockery::mock( Indexable::class );

		$this->hierarchy_repository
			->expects( 'get_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [] );

		$this->assertSame( [], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
	 */
	public function test_get_ancestors_one_ancestor_that_has_no_ancestor_id_found() {
		$indexable = Mockery::mock( Indexable::class );

		$this->hierarchy_repository
			->expects( 'get_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [
				(object) [
					'ancestor_id' => 0,
				],
			] );

		$this->assertSame( [], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
	 */
	public function test_get_ancestors_one_ancestor_that_has_ancestor_id_found() {
		$indexable = Mockery::mock( Indexable::class );

		$this->hierarchy_repository
			->expects( 'get_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [
				(object) [
					'ancestor_id' => 1,
				],
			] );

		$orm_object = Mockery::mock()->makePartial();
		$orm_object
			->expects( 'where_in' )
			->with( 'id', [ 1 ] )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'order_by_expr' )
			->with( 'FIELD(id,1)' )
			->andReturn( $orm_object );
		$orm_object
			->expects( 'find_many' )
			->andReturn( [ $indexable ] );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of ancestors with nothing found.
	 *
	 * @covers ::get_ancestors
	 */
	public function test_get_ancestors_with_multple_ancestors() {
		$indexable = Mockery::mock( Indexable::class );

		$this->hierarchy_repository
			->expects( 'get_ancestors' )
			->once()
			->with( $indexable )
			->andReturn( [
				(object) [
					'ancestor_id' => 1,
				],
				(object) [
					'ancestor_id' => 2,
				],
			] );

		$orm_object = Mockery::mock()->makePartial();
		$orm_object
			->expects( 'where_in' )
			->with( 'id', [ 1, 2 ] )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'order_by_expr' )
			->with( 'FIELD(id,1,2)' )
			->andReturn( $orm_object );
		$orm_object
			->expects( 'find_many' )
			->andReturn( [ $indexable ] );

		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( [ $indexable ], $this->instance->get_ancestors( $indexable ) );
	}

}
