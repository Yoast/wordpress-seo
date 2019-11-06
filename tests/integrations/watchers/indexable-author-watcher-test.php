<?php

namespace Yoast\WP\Free\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Builder;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Integrations\Watchers\Indexable_Author_Watcher;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Watchers\Indexable_Author_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Author_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder_mock;

	/**
	 * @var Indexable_Author_Watcher
	 */
	private $instance;

	public function setUp() {
		$this->repository_mock = Mockery::mock( Indexable_Repository::class );
		$this->builder_mock    = Mockery::mock( Indexable_Builder::class );
		$this->instance        = new Indexable_Author_Watcher( $this->repository_mock, $this->builder_mock );

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[],
			Indexable_Author_Watcher::get_conditionals()
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

		$this->assertNotFalse( \has_action( 'profile_update', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'deleted_user', [ $this->instance, 'delete_indexable' ] ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'delete' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( $indexable_mock );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_not_found() {
		$id = 1;

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( false );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( $indexable_mock );
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'user', $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_not_found() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( false );
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'user', false )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}
}
