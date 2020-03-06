<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Term_Watcher;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Term_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Term_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Term_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder_mock;

	/**
	 * @var Indexable_Term_Watcher
	 */
	private $instance;

	public function setUp() {
		$this->repository_mock  = Mockery::mock( Indexable_Repository::class );
		$this->builder_mock     = Mockery::mock( Indexable_Builder::class );
		$this->instance         = new Indexable_Term_Watcher( $this->repository_mock, $this->builder_mock );

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Term_Watcher::get_conditionals()
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

		$this->assertNotFalse( \has_action( 'edited_term', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'delete_term', [ $this->instance, 'delete_indexable' ] ) );
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

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'term', false )->andReturn( $indexable_mock );
		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$id = 1;
		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'term', false )->andReturn( false );
		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests the build indexable function.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'term', false )->andReturn( $indexable_mock );
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'term', $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the build indexable functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_does_not_exist() {
		$id = 1;

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'term', false )->andReturn( false );
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'term', false )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}
}
