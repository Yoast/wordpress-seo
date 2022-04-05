<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Post_Type_Archive_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_Post_Type_Archive_Watcher_Test extends TestCase {

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
	 * @var Indexable_Post_Type_Archive_Watcher
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->instance   = new Indexable_Post_Type_Archive_Watcher( $this->repository, $this->builder );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
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
		$this->instance->register_hooks();
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests check option with false given as old_value. This happens when the value is updated
	 * the first time.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_first_time_save() {
		Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->assertTrue( $this->instance->check_option( false, [ 'title-ptarchive-my-post-type' => 'baz' ] ) );
	}

	/**
	 * Tests check option with two strings given as input. This should be considered as faulty, because we only
	 * want to accept arrays.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_wrong_input_given() {
		$this->assertFalse( $this->instance->check_option( 'string', 'string' ) );
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
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->assertTrue( $this->instance->check_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'baz' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_new() {
		Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->assertTrue( $this->instance->check_option( [], [ 'title-ptarchive-my-post-type' => 'baz' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_switched() {
		Functions\expect( 'current_time' )->with( 'mysql' )->andReturn( '1234-12-12 12:12:12' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable_mock->expects( 'save' )->once();

		$other_indexable_mock      = Mockery::mock( Indexable::class );
		$other_indexable_mock->orm = Mockery::mock( ORM::class );
		$other_indexable_mock->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$other_indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$other_indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'other-post-type', false )
			->andReturn( $other_indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'other-post-type', $other_indexable_mock )
			->andReturn( $other_indexable_mock );

		$this->assertTrue( $this->instance->check_option( [ 'title-ptarchive-my-post-type' => 'baz' ], [ 'title-ptarchive-other-post-type' => 'baz' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_same_value() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->assertTrue( $this->instance->check_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'bar' ] ) );
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
		$this->assertTrue( $this->instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] ) );
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
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( false );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->instance->build_indexable( 'my-post-type' );
	}
}
