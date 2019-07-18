<?php

namespace Yoast\WP\Free\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
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
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Indexables_Feature_Flag_Conditional::class ],
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
		$repository_mock = Mockery::mock( Indexable_Repository::class );

		$instance = new Indexable_Author_Watcher( $repository_mock, new Indexable_Author_Builder() );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'profile_update', array( $instance, 'build_indexable' ) ) );
		$this->assertNotFalse( \has_action( 'deleted_user', array( $instance, 'delete_indexable' ) ) );
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

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( $indexable_mock );

		$instance = new Indexable_Author_Watcher( $repository_mock, new Indexable_Author_Builder() );

		$instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_not_found() {
		$id = 1;

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( false );

		$instance = new Indexable_Author_Watcher( $repository_mock, new Indexable_Author_Builder() );

		$instance->delete_indexable( $id );
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

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Author_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( $id, $indexable_mock )->andReturn( $indexable_mock );

		$instance = new Indexable_Author_Watcher( $repository_mock, $builder_mock );

		$instance->build_indexable( $id );
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

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'user', false )->andReturn( false );
		$repository_mock->expects( 'create_for_id_and_type' )->once()->with( $id, 'user' )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Author_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Author_Watcher( $repository_mock, $builder_mock );

		$instance->build_indexable( $id );
	}
}
