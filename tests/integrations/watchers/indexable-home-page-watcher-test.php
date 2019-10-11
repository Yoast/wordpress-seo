<?php

namespace Yoast\WP\Free\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\Free\Integrations\Watchers\Indexable_Home_Page_Watcher;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Home_Page_Watcher_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Watchers\Indexable_Home_Page_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Home_Page_Watcher_Test extends TestCase {

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[],
			Indexable_Home_Page_Watcher::get_conditionals()
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
		$builder_mock    = Mockery::mock( Indexable_Home_Page_Builder::class );

		$instance = new Indexable_Home_Page_Watcher( $repository_mock, $builder_mock );
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $instance, 'check_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_wpseo_social', [ $instance, 'check_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_blog_public', [ $instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_blogdescription', [ $instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_home', [ $instance, 'build_indexable' ] ) );
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
		$repository_mock->expects( 'find_for_home_page' )->once()->with( false )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Home_Page_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( $indexable_mock )->andReturn( $indexable_mock );

		$instance = new Indexable_Home_Page_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'title-home-wpseo' => 'bar' ], [ 'title-home-wpseo' => 'baz' ], 'wpseo_titles' );
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
		$repository_mock->expects( 'find_for_home_page' )->never();

		$builder_mock = Mockery::mock( Indexable_Home_Page_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Home_Page_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ], 'wpseo_titles' );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_social_value() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_home_page' )->once()->with( false )->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Home_Page_Builder::class );
		$builder_mock->expects( 'build' )->once()->with( $indexable_mock )->andReturn( $indexable_mock );

		$instance = new Indexable_Home_Page_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'og_frontpage_desc' => 'bar' ], [ 'og_frontpage_desc' => 'baz' ], 'wpseo_social' );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_other_option() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->never();

		$repository_mock = Mockery::mock( Indexable_Repository::class );
		$repository_mock->expects( 'find_for_home_page' )->never();

		$builder_mock = Mockery::mock( Indexable_Home_Page_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Home_Page_Watcher( $repository_mock, $builder_mock );
		$instance->check_option( [ 'og_frontpage_desc' => 'bar' ], [ 'og_frontpage_desc' => 'baz' ], 'wpseo_something' );
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
		$repository_mock->expects( 'find_for_home_page' )->once()->with( false )->andReturn( false );
		$repository_mock->expects( 'create_for_home_page' )->once()->andReturn( $indexable_mock );

		$builder_mock = Mockery::mock( Indexable_Home_Page_Builder::class );
		$builder_mock->expects( 'build' )->never();

		$instance = new Indexable_Home_Page_Watcher( $repository_mock, $builder_mock );
		$instance->build_indexable();
	}
}
