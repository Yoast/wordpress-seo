<?php

namespace Yoast\WP\Free\Tests\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Helpers\Indexable_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Watchers\Indexable_Post_Watcher;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\Free\Watchers\Indexable_Post_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Indexables_Feature_Flag_Conditional::class ],
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
		$helper_mock  = Mockery::mock( Indexable_Helper::class );
		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_insert_post', array( $instance, 'build_indexable' ) ) );
		$this->assertNotFalse( \has_action( 'delete_post', array( $instance, 'delete_indexable' ) ) );
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

		$helper_mock = Mockery::mock( Indexable_Helper::class );
		$helper_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$id = 1;

		$helper_mock = Mockery::mock( Indexable_Helper::class );
		$helper_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );

		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->delete_indexable( $id );
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

		$helper_mock = Mockery::mock( Indexable_Helper::class );
		$helper_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );
		$helper_mock->expects( 'create_for_id_and_type' )->never();

		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( $id, $indexable_mock )->andReturn( $indexable_mock );

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_revision() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( true );

		$helper_mock = Mockery::mock( Indexable_Helper::class );
		$helper_mock->expects( 'find_by_id_and_type' )->never();
		$helper_mock->expects( 'create_for_id_and_type' )->never();

		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->build_indexable( $id );
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

		$helper_mock = Mockery::mock( Indexable_Helper::class );
		$helper_mock->expects( 'find_by_id_and_type' )->never();
		$helper_mock->expects( 'create_for_id_and_type' )->never();

		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->build_indexable( $id );
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

		$helper_mock = Mockery::mock( Indexable_Helper::class );
		$helper_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );
		$helper_mock->expects( 'create_for_id_and_type' )->once()->with( $id, 'post' )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Post_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Post_Watcher( $helper_mock, $builder_mock );

		$instance->build_indexable( $id );
	}
}
