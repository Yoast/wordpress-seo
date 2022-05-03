<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Home_Page_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Home_Page_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Home_Page_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Home_Page_Watcher
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 5 words is fine.
 */
class Indexable_Home_Page_Watcher_Test extends TestCase {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository;

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Home_Page_Watcher
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->instance   = new Indexable_Home_Page_Watcher( $this->repository, $this->builder );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
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
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_wpseo_social', [ $this->instance, 'check_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_blog_public', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_blogdescription', [ $this->instance, 'build_indexable' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value() {
		Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_home_page' )
			->once()
			->with( false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_home_page' )
			->once()
			->with( $indexable_mock )
			->andReturn( $indexable_mock );

		$this->instance->check_option( [ 'title-home-wpseo' => 'bar' ], [ 'title-home-wpseo' => 'baz' ], 'wpseo_titles' );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_without_change() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ], 'wpseo_titles' );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_social_value() {
		Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_home_page' )
			->once()
			->with( false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_home_page' )
			->once()
			->with( $indexable_mock )
			->andReturn( $indexable_mock );

		$this->instance->check_option( [ 'open_graph_frontpage_desc' => 'bar' ], [ 'open_graph_frontpage_desc' => 'baz' ], 'wpseo_titles' );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_other_option() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_option( [ 'open_graph_frontpage_desc' => 'bar' ], [ 'open_graph_frontpage_desc' => 'baz' ], 'wpseo_something' );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_without_indexable() {
		Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_home_page' )
			->once()
			->with( false )
			->andReturn( false );

		$this->builder
			->expects( 'build_for_home_page' )
			->once()
			->with( false )
			->andReturn( $indexable_mock );

		$this->instance->build_indexable();
	}
}
