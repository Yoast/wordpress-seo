<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_System_Page_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_System_Page_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_System_Page_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_System_Page_Watcher
 */
final class Indexable_System_Page_Watcher_Test extends TestCase {

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
	 * Represents the instance we want to test.
	 *
	 * @var Indexable_System_Page_Watcher
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
		$this->instance   = new Indexable_System_Page_Watcher( $this->repository, $this->builder );
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
			Indexable_System_Page_Watcher::get_conditionals()
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

		$this->repository
			->expects( 'find_for_system_page' )
			->once()
			->with( 'search-result', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_system_page' )
			->once()
			->with( 'search-result', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->instance->check_option( [ 'title-search-wpseo' => 'bar' ], [ 'title-search-wpseo' => 'baz' ] );
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
		$this->instance->check_option(
			[
				'other_key'          => 'bar',
				'title-search-wpseo' => 'baz',
				'title-404-wpseo'    => 'baz',
			],
			[
				'other_key'          => 'baz',
				'title-search-wpseo' => 'baz',
				'title-404-wpseo'    => 'baz',
			]
		);
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::build_indexable
	 *
	 * @return void
	 */
	public function test_build_indexable_without_indexable() {
		$indexable_mock = Mockery::mock( Indexable::class );

		$this->repository
			->expects( 'find_for_system_page' )
			->once()
			->with( '404-page', false )
			->andReturn( false );

		$this->builder
			->expects( 'build_for_system_page' )
			->once()
			->with( '404-page', false )
			->andReturn( $indexable_mock );

		$this->instance->build_indexable( '404-page' );
	}
}
