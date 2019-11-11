<?php

namespace Yoast\WP\Free\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Builders\Indexable_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Base_Migration_Conditional;
use Yoast\WP\Free\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Watchers\Indexable_Post_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $hierarchy_repository_mock;

	/**
	 * @var Indexable_Post_Watcher
	 */
	private $instance;

	public function setUp() {
		$this->repository_mock           = Mockery::mock( Indexable_Repository::class );
		$this->builder_mock              = Mockery::mock( Indexable_Builder::class );
		$this->hierarchy_repository_mock = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->instance                  = new Indexable_Post_Watcher( $this->repository_mock, $this->builder_mock, $this->hierarchy_repository_mock );

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Indexables_Base_Migration_Conditional::class ],
			Indexable_Post_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_insert_post', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'delete_post', [ $this->instance, 'delete_indexable' ] ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->id = 1;
		$indexable_mock->expects( 'delete' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );
		$this->hierarchy_repository_mock->expects( 'clear_ancestors' )->once()->with( $id )->andReturn( true );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$id = 1;

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( false );

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );
		$this->repository_mock->expects( 'create_for_id_and_type' )->never();
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'post', $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_revision() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( true );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_autosave() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( true );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_does_not_exist() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( false );

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}
}
