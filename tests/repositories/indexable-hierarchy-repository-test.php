<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Repositories
 */

namespace Yoast\WP\SEO\Tests\Repositories;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
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
		$this->builder  = Mockery::mock( Indexable_Hierarchy_Builder::class );
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
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 1;

		$ancestors = [ 2 ];

		$orm_object = Mockery::mock();

		$orm_object
			->expects( 'select' )
			->once()
			->with( 'ancestor_id' )
			->andReturn( $orm_object );

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
			->expects( 'find_array' )
			->once()
			->andReturn( [ [ 'ancestor_id' => 2 ] ] );

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
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 1;

		$parent_indexable     = Mockery::mock( Indexable_Mock::class );
		$parent_indexable->id = 2;
		$indexable->ancestors = [ $parent_indexable ];

		$ancestors = [ 2 ];

		$orm_object = Mockery::mock();

		$orm_object
			->expects( 'select' )
			->once()
			->with( 'ancestor_id' )
			->andReturn( $orm_object );

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
			->expects( 'find_array' )
			->once()
			->andReturn( [] );

		$this->instance->set_builder( $this->builder );

		$this->instance
			->expects( 'query' )
			->once()
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
		$hierarchy->blog_id      = 1;

		Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );

		$hierarchy->expects( 'save' )->once()->andReturn( true );

		$orm_object = Mockery::mock()->makePartial();

		$orm_object
			->expects( 'create' )
			->with(
				[
					'indexable_id' => 1,
					'ancestor_id'  => 2,
					'depth'        => 1,
					'blog_id'      => 1,
				]
			)
			->andReturn( $hierarchy );
		$this->instance->expects( 'query' )->andReturn( $orm_object );

		$this->assertTrue( $this->instance->add_ancestor( 1, 2, 1 ) );
	}

	/**
	 * Tests if the query method returns an instance of the ORM class that
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
		$this->assertInstanceOf( ORM::class, $query );
	}
}
