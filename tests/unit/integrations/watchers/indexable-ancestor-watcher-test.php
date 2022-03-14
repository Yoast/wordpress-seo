<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Ancestor_Watcher;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Ancestor_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Ancestor_Watcher
 */
class Indexable_Ancestor_Watcher_Test extends TestCase {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Ancestor_Watcher
	 */
	protected $instance;

	/**
	 * Represents the indexable hierarchy builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Builder
	 */
	protected $indexable_hierarchy_builder;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Represents the indexable hierarchy repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	protected $indexable_hierarchy_repository;

	/**
	 * WordPress database mock.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	protected $wpdb;

	/**
	 * Represents the permalink helper.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Permalink_Helper
	 */
	protected $permalink_helper;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository           = Mockery::mock( Indexable_Repository::class );
		$this->indexable_hierarchy_builder    = Mockery::mock( Indexable_Hierarchy_Builder::class );
		$this->indexable_hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->wpdb                           = Mockery::mock( wpdb::class );
		$this->permalink_helper               = Mockery::mock( Permalink_Helper::class );
		$this->post_type_helper               = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Indexable_Ancestor_Watcher(
			$this->indexable_repository,
			$this->indexable_hierarchy_builder,
			$this->indexable_hierarchy_repository,
			$this->wpdb,
			$this->permalink_helper,
			$this->post_type_helper
		);
	}

	/**
	 * Tests the clear ancestors method when the object type is not a post or term.
	 *
	 * @covers ::reset_children
	 */
	public function test_reset_children_for_non_allowed_object_type() {
		$indexable        = Mockery::mock( Indexable_Mock::class );
		$indexable_before = Mockery::mock( Indexable_Mock::class );

		$indexable->object_type = 'user';

		$this->assertFalse( $this->instance->reset_children( $indexable, $indexable_before ) );
	}

	/**
	 * Tests the clear ancestors method having the permalink not changed.
	 *
	 * @covers ::reset_children
	 */
	public function test_reset_children_for_non_changed_permalink() {
		$indexable        = Mockery::mock( Indexable_Mock::class );
		$indexable_before = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink        = 'https://example.org/permalink';
		$indexable_before->permalink = 'https://example.org/permalink';

		$indexable->object_type = 'post';

		$this->assertFalse( $this->instance->reset_children( $indexable, $indexable_before ) );
	}

	/**
	 * Tests if the dependencies are set as expected.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
		$this->assertInstanceOf(
			Indexable_Hierarchy_Builder::class,
			$this->getPropertyValue( $this->instance, 'indexable_hierarchy_builder' )
		);
		$this->assertInstanceOf(
			Permalink_Helper::class,
			$this->getPropertyValue( $this->instance, 'permalink_helper' )
		);
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Ancestor_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		self::assertNotFalse( \has_action( 'wpseo_save_indexable', [ $this->instance, 'reset_children' ] ) );
	}

	/**
	 * Tests the reset_children method.
	 *
	 * @covers ::reset_children
	 * @covers ::update_hierarchy_and_permalink
	 */
	public function test_reset_children() {
		$indexable        = Mockery::mock( Indexable_Mock::class );
		$indexable_before = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink        = 'https://example.org/permalink';
		$indexable_before->permalink = 'https://example.org/old-permalink';

		$indexable->object_type = 'post';

		$child_indexable            = Mockery::mock( Indexable_Mock::class );
		$child_indexable->permalink = 'https://example.org/old-child-permalink';
		$child_indexable->expects( 'save' )->once();

		$this->indexable_hierarchy_builder->expects( 'build' )->with( $child_indexable );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->once()
			->with( $child_indexable )
			->andReturn( 'https://example.org/child-permalink' );

		$this->indexable_hierarchy_repository
			->expects( 'find_children' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$this->indexable_repository
			->expects( 'find_by_ids' )
			->with( [ 1 ] )
			->andReturn( [ $child_indexable ] );

		$this->assertTrue( $this->instance->reset_children( $indexable, $indexable_before ) );
	}

	/**
	 * Tests the reset_children method when the parent indexable is a term.
	 *
	 * @covers ::reset_children
	 * @covers ::update_hierarchy_and_permalink
	 */
	public function test_reset_children_for_term() {
		$indexable        = Mockery::mock( Indexable_Mock::class );
		$indexable_before = Mockery::mock( Indexable_Mock::class );

		$indexable->permalink        = 'https://example.org/permalink';
		$indexable_before->permalink = 'https://example.org/old-permalink';
		$indexable->object_type      = 'term';
		$indexable->object_id        = 1;

		$child_indexable              = Mockery::mock( Indexable_Mock::class );
		$child_indexable->object_type = 'term';
		$child_indexable->permalink   = 'https://example.org/old-child-permalink';
		$child_indexable->object_id   = 23;
		$child_indexable->expects( 'save' )->once();

		$this->indexable_hierarchy_repository
			->expects( 'find_children' )
			->once()
			->with( $indexable )
			->andReturn( [ 1 ] );

		$this->indexable_repository
			->expects( 'find_by_ids' )
			->with( [ 1 ] )
			->andReturn( [ $child_indexable ] );

		$this->indexable_hierarchy_builder->expects( 'build' )->with( $child_indexable );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->once()
			->with( $child_indexable )
			->andReturn( 'https://example.org/child-permalink' );

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( [ $child_indexable ], 'object_id' )
			->andReturn( [ $child_indexable->object_id ] );

		$this->set_expectations_for_get_object_ids_for_term( $indexable->object_id, $child_indexable->object_id );

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( [], 'object_id' )
			->andReturn( [] );

		$indexable_term_1 = Mockery::mock( Indexable_Mock::class );
		$indexable_term_2 = Mockery::mock( Indexable_Mock::class );

		$indexable_term_1->id = 567;
		$indexable_term_2->id = 568;

		$this->indexable_repository->expects( 'find_by_multiple_ids_and_type' )
			->with( [ 431, 23, 21 ], 'post', false )
			->andReturn( [ $indexable_term_1, $indexable_term_2 ] );

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( [ $indexable_term_1, $indexable_term_2 ], 'id' )
			->andReturn( [ 101, 102 ] );

		$this->indexable_hierarchy_repository->expects( 'find_children_by_ancestor_ids' )
			->with( [ 101, 102 ] )
			->andReturn( [ 566, 567, 569 ] );

		$additional_indexable = Mockery::mock( Indexable_Mock::class );

		$this->indexable_repository->expects( 'find_by_ids' )
			->with( [ 566, 567, 569 ] )
			->andReturn( [ $additional_indexable ] );

		$this->set_expectations_for_update_hierarchy_and_permalink( $indexable_term_1, $indexable_term_2, $additional_indexable );

		$this->assertTrue( $this->instance->reset_children( $indexable, $indexable_before ) );
		$this->assertSame( 'https://example.org/permalink', $indexable_term_1->permalink );
		$this->assertSame( 'https://example.org/permalink', $indexable_term_2->permalink );
		$this->assertSame( 'https://example.org/permalink', $additional_indexable->permalink );
	}

	/**
	 * Tests the get_children_for_term method.
	 *
	 * @covers ::get_children_for_term
	 * @covers ::get_object_ids_for_term
	 */
	public function test_get_children_for_term() {
		$indexable_1              = Mockery::mock( Indexable_Mock::class );
		$indexable_1->object_id   = 21;
		$indexable_1->object_type = 'term';

		$indexable_2              = Mockery::mock( Indexable_Mock::class );
		$indexable_2->object_id   = 22;
		$indexable_2->object_type = 'term';

		$indexable_3              = Mockery::mock( Indexable_Mock::class );
		$indexable_3->object_id   = 23;
		$indexable_3->object_type = 'post';

		$indexable_4              = Mockery::mock( Indexable_Mock::class );
		$indexable_4->object_id   = 24;
		$indexable_4->object_type = 'post';

		$term_id = 1;

		Functions\expect( 'wp_list_pluck' )->andReturnUsing(
			static function ( $haystack, $prop ) {
				return \array_map(
					static function ( $e ) use ( $prop ) {
						return $e->{$prop};
					},
					$haystack
				);
			}
		);

		$this->set_expectations_for_get_object_ids_for_term( $term_id, $indexable_1->object_id, $indexable_2->object_id );

		$indexable_term_1 = Mockery::mock( Indexable_Mock::class );
		$indexable_term_2 = Mockery::mock( Indexable_Mock::class );

		$indexable_term_1->id = 567;
		$indexable_term_2->id = 568;

		$this->indexable_repository->expects( 'find_by_multiple_ids_and_type' )
			->with(
				[
					0 => 431,
					2 => 21,
				],
				'post',
				false
			)
			->andReturn( [ $indexable_term_1, $indexable_term_2 ] );

		$this->indexable_hierarchy_repository->expects( 'find_children_by_ancestor_ids' )
			->with( [ 567, 568 ] )
			->andReturn( [ 566, 567, 569 ] );

		$additional_indexable_2 = Mockery::mock( Indexable_Mock::class );

		$this->indexable_repository->expects( 'find_by_ids' )
			->with(
				[
					0 => 566,
					2 => 569,
				]
			)
			->andReturn( [ $additional_indexable_2 ] );

		$actual = $this->instance->get_children_for_term( 1, [ $indexable_1, $indexable_2, $indexable_3, $indexable_4 ] );

		$this->assertSame( [ $indexable_term_1, $indexable_term_2, $additional_indexable_2 ], $actual );
	}

	/**
	 * Sets the expectations for the get_object_ids_for term method.
	 *
	 * @param int ...$object_ids The object ids.
	 */
	private function set_expectations_for_get_object_ids_for_term( ...$object_ids ) {
		$this->wpdb->term_taxonomy      = 'wp_term_taxonomy';
		$this->wpdb->term_relationships = 'wp_term_relationships';

		$this->wpdb->expects( 'prepare' )
			->with(
				'SELECT term_taxonomy_id
				FROM wp_term_taxonomy
				WHERE term_id IN( ' . \implode( ', ', \array_fill( 0, ( \count( $object_ids ) ), '%s' ) ) . ' )',
				...$object_ids
			);

		$this->wpdb->expects( 'get_col' )
			->andReturn( [ 321, 322, 323 ] );

		$this->wpdb->expects( 'prepare' )
			->with(
				'SELECT DISTINCT object_id
				FROM wp_term_relationships
				WHERE term_taxonomy_id IN( %s, %s, %s )',
				321,
				322,
				323
			);

		$this->wpdb->expects( 'get_col' )
			->andReturn( [ 431, 23, 21 ] );
	}

	/**
	 * Sets the expectations for the update_hierarchy_and_permalink method.
	 *
	 * @param Indexable_Mock ...$indexables The indexables.
	 */
	private function set_expectations_for_update_hierarchy_and_permalink( ...$indexables ) {
		foreach ( $indexables as $indexable ) {
			$this->indexable_hierarchy_builder->expects( 'build' )
				->with( $indexable );

			$this->permalink_helper->expects( 'get_permalink_for_indexable' )
				->with( $indexable )
				->andReturn( 'https://example.org/permalink' );

			$indexable->expects( 'save' );
		}
	}
}
