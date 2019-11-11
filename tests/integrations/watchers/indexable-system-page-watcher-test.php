<?php

namespace Yoast\WP\Free\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\Free\Builders\Indexable_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Base_Migration_Conditional;
use Yoast\WP\Free\Integrations\Watchers\Indexable_System_Page_Watcher;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_System_Page_Watcher_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Watchers\Indexable_System_Page_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_System_Page_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder_mock;

	/**
	 * @var Indexable_System_Page_Watcher
	 */
	private $instance;

	public function setUp() {
		$this->repository_mock = Mockery::mock( Indexable_Repository::class );
		$this->builder_mock    = Mockery::mock( Indexable_Builder::class );
		$this->instance        = new Indexable_System_Page_Watcher( $this->repository_mock, $this->builder_mock );

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Indexables_Base_Migration_Conditional::class ],
			Indexable_System_Page_Watcher::get_conditionals()
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
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_for_system_page' )->once()->with( 'search-result', false )->andReturn( $indexable_mock );
		$this->builder_mock->expects( 'build_for_system_page' )->once()->with( 'search-result', $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->check_option( [ 'title-search-wpseo' => 'bar' ], [ 'title-search-wpseo' => 'baz' ] );
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
		$this->instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] );
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

		$this->repository_mock->expects( 'find_for_system_page' )->once()->with( '404-page', false )->andReturn( false );
		$this->builder_mock->expects( 'build_for_system_page' )->once()->with( '404-page', false )->andReturn( $indexable_mock );

		$this->instance->build_indexable( '404-page' );
	}
}
