<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Cleanup_Repository;
use Yoast\WP\SEO\User_Meta\User_Interface\Cleanup_Integration;

/**
 * Tests the cleanup integration.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\User_Interface\Cleanup_Integration
 */
final class Cleanup_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Cleanup_Integration
	 */
	private $instance;

	/**
	 * Holds the cleanup repository.
	 *
	 * @var Mockery\MockInterface|Cleanup_Repository
	 */
	private $cleanup_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->cleanup_repository = Mockery::mock( Cleanup_Repository::class );

		$this->instance = new Cleanup_Integration(
			$this->cleanup_repository
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Cleanup_Integration::get_conditionals() );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Cleanup_Repository::class,
			$this->getPropertyValue( $this->instance, 'cleanup_repository' )
		);
	}

	/**
	 * Tests registering hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_misc_cleanup_tasks' )
			->once()
			->with( [ $this->instance, 'add_user_meta_cleanup_tasks' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests add_user_meta_cleanup_tasks.
	 *
	 * @covers ::add_user_meta_cleanup_tasks
	 *
	 * @return void
	 */
	public function test_add_user_meta_cleanup_tasks() {
		$result = $this->instance->add_user_meta_cleanup_tasks( [] );

		$this->assertArrayHasKey( 'clean_selected_empty_usermeta', $result );
		$this->assertSame( 1, \count( $result ) );
	}
}
