<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Date_Archive_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Date_Archive_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Date_Archive_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Date_Archive_Watcher
 */
final class Indexable_Date_Archive_Watcher_Test extends TestCase {

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
	 * @var Indexable_Date_Archive_Watcher
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->instance   = new Indexable_Date_Archive_Watcher( $this->repository, $this->builder );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Date_Archive_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 *
	 * @return void
	 */
	public function test_update_wpseo_titles_value() {
		$indexable_mock = Mockery::mock( Indexable::class );

		$this->repository->expects( 'find_for_date_archive' )->once()->with( false )->andReturn( $indexable_mock );
		$this->builder->expects( 'build_for_date_archive' )->once()->with( $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->check_option( [ 'title-archive-wpseo' => 'bar' ], [ 'title-archive-wpseo' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 *
	 * @return void
	 */
	public function test_update_wpseo_titles_value_without_change() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_option( [ 'title-archive-wpseo' => 'bar' ], [ 'title-archive-wpseo' => 'bar' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 *
	 * @return void
	 */
	public function test_update_wpseo_titles_value_other_key() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] );
	}

	/**
	 * Tests if build indexable works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::build_indexable
	 *
	 * @return void
	 */
	public function test_build_indexable_without_indexable() {
		$indexable_mock = Mockery::mock( Indexable::class );

		$this->repository->expects( 'find_for_date_archive' )->once()->with( false )->andReturn( false );
		$this->builder->expects( 'build_for_date_archive' )->once()->with( false )->andReturn( $indexable_mock );

		$this->instance->build_indexable();
	}
}
