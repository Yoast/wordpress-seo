<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Hierarchy_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Hierarchy_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository
 *
 * @group indexables
 * @group repositories
 */
final class Indexable_Hierarchy_Repository_Test extends TestCase {

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
	 * Represents the indexable helper.
	 *
	 * @var Mockery\Mock|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * {@inheritDoc}
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance         = Mockery::mock( Indexable_Hierarchy_Repository::class )->makePartial();
		$this->builder          = Mockery::mock( Indexable_Hierarchy_Builder::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
	}

	/**
	 * Tests setting the builder object.
	 *
	 * @covers ::set_builder
	 *
	 * @return void
	 */
	public function test_set_builder() {
		$this->instance->set_builder( $this->builder );

		$this->assertInstanceOf(
			Indexable_Hierarchy_Builder::class,
			$this->getPropertyValue( $this->instance, 'builder' )
		);
	}

	/**
	 * Tests setting the helper object.
	 *
	 * @covers ::set_helper
	 *
	 * @return void
	 */
	public function test_set_helper() {
		$this->instance->set_helper( $this->indexable_helper );

		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' )
		);
	}

	/**
	 * Tests the retrieval of the find_ancestors when having already results.
	 *
	 * @covers ::find_ancestors
	 *
	 * @return void
	 */
	public function test_find_ancestors_having_results() {
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 1;

		$ancestors = [ 2 ];

		$orm_object = Mockery::mock( ORM::class );

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

		Functions\expect( 'wp_list_pluck' )->once()->andReturn( [ 0 => 2 ] );

		$this->assertSame( $ancestors, $this->instance->find_ancestors( $indexable ) );
	}

	/**
	 * Tests retrieval of the ancestors when having no results the first time we query.
	 *
	 * @covers ::find_ancestors
	 *
	 * @return void
	 */
	public function test_find_ancestors_having_no_results_first_time() {
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 1;

		$parent_indexable     = Mockery::mock( Indexable_Mock::class );
		$parent_indexable->id = 2;
		$indexable->ancestors = [ $parent_indexable ];

		$ancestors = [ 2 ];

		$orm_object = Mockery::mock( ORM::class );

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

		Functions\expect( 'wp_list_pluck' )->once()->andReturn( [ 0 => 2 ] );

		$this->assertSame( $ancestors, $this->instance->find_ancestors( $indexable ) );
	}

	/**
	 * Tests removing all ancestors for given indexable.
	 *
	 * @covers ::clear_ancestors
	 *
	 * @return void
	 */
	public function test_clear_ancestors() {
		$orm_object = Mockery::mock( ORM::class )->makePartial();
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
	 *
	 * @return void
	 */
	public function test_add_ancestor() {
		$this->instance->set_helper( $this->indexable_helper );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturnTrue();

		$hierarchy               = Mockery::mock( Indexable_Hierarchy_Mock::class );
		$hierarchy->indexable_id = 1;
		$hierarchy->ancestor_id  = 2;
		$hierarchy->depth        = 1;
		$hierarchy->blog_id      = 1;

		Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );

		$orm_object = Mockery::mock( ORM::class )->makePartial();

		$hierarchy->expects( 'save' )->once()->andReturn( true );

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
	 *
	 * @return void
	 */
	public function test_query() {
		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$GLOBALS['wpdb'] = $wpdb;

		$query = $this->instance->query();

		$this->assertEquals( '\Yoast\WP\SEO\Models\Indexable_Hierarchy', $this->getPropertyValue( $query, 'class_name' ) );
		$this->assertInstanceOf( ORM::class, $query );
	}

	/**
	 * Tests the retrieval of the children for an indexable.
	 *
	 * @covers ::find_children
	 *
	 * @return void
	 */
	public function test_find_children() {
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 1;

		$orm_object = Mockery::mock( ORM::class );

		$orm_object
			->expects( 'select' )
			->once()
			->with( 'indexable_id' )
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->once()
			->with( 'ancestor_id', 1 )
			->andReturnSelf();

		$children = [
			[ 'indexable_id' => 2 ],
			[ 'indexable_id' => 3 ],
		];

		$orm_object
			->expects( 'find_array' )
			->once()
			->andReturn( $children );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		Functions\expect( 'wp_list_pluck' )->once()->andReturn(
			[
				0 => 2,
				1 => 3,
			]
		);

		$this->assertSame( [ 2, 3 ], $this->instance->find_children( $indexable ) );
	}

	/**
	 * Tests the retrieval of the children for an indexable that has no children.
	 *
	 * @covers ::find_children
	 *
	 * @return void
	 */
	public function test_find_children_with_no_children_found() {
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 1;

		$orm_object = Mockery::mock( ORM::class );

		$orm_object
			->expects( 'select' )
			->once()
			->with( 'indexable_id' )
			->andReturnSelf();

		$orm_object
			->expects( 'where' )
			->once()
			->with( 'ancestor_id', 1 )
			->andReturnSelf();

		$orm_object
			->expects( 'find_array' )
			->once()
			->andReturn( [] );

		$this->instance
			->expects( 'query' )
			->andReturn( $orm_object );

		$this->assertSame( [], $this->instance->find_children( $indexable ) );
	}
}
