<?php

namespace Yoast\WP\Free\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\Free\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\Free\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Post_Type_Archive_Watcher_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Type_Archive_Watcher_Test extends TestCase {

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[],
			Indexable_Post_Type_Archive_Watcher::get_conditionals()
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
		$builder_mock    = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $instance, 'check_option' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( 'my-post-type', $indexable_mock )->andReturn( $indexable_mock );

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_new() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( 'my-post-type', $indexable_mock )->andReturn( $indexable_mock );

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [], [ 'title-ptarchive-my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_switched() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$other_indexable_mock = Mockery::mock( Indexable::class );
		$other_indexable_mock->expects( 'save' )->once();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $indexable_mock );
		$repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'other-post-type', false )->andReturn( $other_indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( 'my-post-type', $indexable_mock )->andReturn( $indexable_mock );
		$builder_mock->expects( 'build' )->once()->with( 'other-post-type', $other_indexable_mock )->andReturn( $other_indexable_mock );

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'title-ptarchive-my-post-type' => 'baz' ], [ 'title-ptarchive-other-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_same_value() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->never();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_post_type_archive' )->never();

		$builder_mock = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'bar' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_without_change() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->never();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_post_type_archive' )->never();

		$builder_mock = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_without_indexable() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( false );
		$repository_mock->expects( 'create_for_post_type_archive' )->once()->with( 'my-post-type' )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Post_Type_Archive_Watcher( $repository_mock, $builder_mock );
		$instance->build_indexable( 'my-post-type' );
	}
}
