<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters
 */

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\ORM\ORMWrapper;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Hierarchy_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository
 *
 * @group indexables
 * @group repositories
 */
class Indexable_Hierarchy_Repository_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\Mock|Indexable_Hierarchy_Repository
	 */
	protected $instance;

	/**
	 * Represents the hierarchy builder.
	 *
	 * @var Mockery\Mock|Indexable_Hierarchy_Builder
	 */
	protected $builder;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Indexable_Hierarchy_Repository::class )->makePartial();
		$this->builder  = Mockery::mock( Indexable_Hierarchy_Builder::class )->makePartial();
	}

	/**
	 * Tests setting the builder object.
	 *
	 * @covers ::set_builder
	 */
	public function test_set_builder() {
		$this->instance->set_builder( $this->builder );

		$this->assertAttributeInstanceOf( Indexable_Hierarchy_Builder::class, 'builder', $this->instance );
	}

	/**
	 * Tests the retrieval of the find_ancestors when having already results.
	 *
	 * @covers ::find_ancestors
	 */
	public function test_find_ancestors_having_results() {
		$indexable     = Mockery::mock( Indexable::class );
		$indexable->id = 1;

		$ancestors = [
			(object) [
				'indexable_id' => 1,
				'ancestor_id'  => 2,
				'depth'        => 1,
			],
		];

		$orm_object = Mockery::mock()->makePartial();
		$orm_object
			->expects( 'where' )
			->once()
			->with( 'indexable_id', 1 )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'order_by_desc' )
			->once()
			->with( 'depth' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'find_many' )
			->once()
			->andReturn( $ancestors );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$this->assertSame( $ancestors, $this->instance->find_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of the ancestors when having no results the first time we query.
	 *
	 * @covers ::find_ancestors
	 */
	public function test_find_ancestors_having_no_results_first_time() {
		$indexable     = Mockery::mock( Indexable::class );
		$indexable->id = 1;

		$ancestors = [
			(object) [
				'indexable_id' => 1,
				'ancestor_id'  => 2,
				'depth'        => 1,
			],
		];

		$orm_object = Mockery::mock()->makePartial();
		$orm_object
			->expects( 'where' )
			->twice()
			->with( 'indexable_id', 1 )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'order_by_desc' )
			->twice()
			->with( 'depth' )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'find_many' )
			->twice()
			->andReturn( [], $ancestors );

		$this->instance->set_builder( $this->builder );

		$this->instance
			->expects( 'query' )
			->twice()
			->andReturn( $orm_object );

		$this->builder
			->expects( 'build' )
			->once()
			->with( $indexable )
			->andReturn( $indexable );

		$this->assertSame( $ancestors, $this->instance->find_ancestors( $indexable ) );
	}

	/**
	 * Tests removing all ancestors for given indexable.
	 *
	 * @covers ::clear_ancestors
	 */
	public function test_clear_ancestors() {
		$orm_object = Mockery::mock()->makePartial();
		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$orm_object
			->expects( 'where' )
			->once()
			->with( 'indexable_id', 1 )
			->andReturn( $orm_object );

		$orm_object
			->expects( 'delete_many' )
			->once();

		$this->instance->clear_ancestors( 1 );
	}

	/**
	 * Tests adding an ancestor.
	 *
	 * @covers ::add_ancestor
	 */
	public function test_add_ancestor() {
		$hierarchy               = Mockery::mock();
		$hierarchy->indexable_id = 1;
		$hierarchy->ancestor_id  = 2;
		$hierarchy->depth        = 1;

		$hierarchy->expects( 'save' )->once();

		$orm_object = Mockery::mock()->makePartial();

		$orm_object
			->expects( 'create' )
			->with( [
				'indexable_id' => 1,
				'ancestor_id'  => 2,
				'depth'        => 1,
			] )
			->andReturn( $hierarchy );
		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertSame( $hierarchy, $this->instance->add_ancestor( 1, 2, 1 ) );
	}

	/**
	 * Tests if the query method returns an instance of the ORMWrapper class that
	 * represents the Indexable_Hierarchy.
	 *
	 * @covers ::query
	 */
	public function test_query() {
		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$GLOBALS['wpdb'] = $wpdb;

		$query = $this->instance->query();

		$this->assertAttributeEquals( '\Yoast\WP\SEO\Models\Indexable_Hierarchy', 'class_name', $query );
		$this->assertInstanceOf( ORMWrapper::class, $query );
	}
}
