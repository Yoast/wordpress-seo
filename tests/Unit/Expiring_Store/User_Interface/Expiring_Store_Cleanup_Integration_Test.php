<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Expiring_Store\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\User_Interface\Expiring_Store_Cleanup_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Expiring_Store_Cleanup_Integration.
 *
 * @group expiring-store
 *
 * @coversDefaultClass \Yoast\WP\SEO\Expiring_Store\User_Interface\Expiring_Store_Cleanup_Integration
 */
final class Expiring_Store_Cleanup_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Expiring_Store_Cleanup_Integration
	 */
	private $instance;

	/**
	 * Holds the expiring store mock.
	 *
	 * @var Mockery\MockInterface|Expiring_Store
	 */
	private $expiring_store;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->expiring_store = Mockery::mock( Expiring_Store::class );

		$this->instance = new Expiring_Store_Cleanup_Integration(
			$this->expiring_store,
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
		$this->assertEquals( [], Expiring_Store_Cleanup_Integration::get_conditionals() );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Expiring_Store::class,
			$this->getPropertyValue( $this->instance, 'expiring_store' ),
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
			->with( [ $this->instance, 'add_cleanup_task' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests add_cleanup_task.
	 *
	 * @covers ::add_cleanup_task
	 *
	 * @return void
	 */
	public function test_add_cleanup_task() {
		$result = $this->instance->add_cleanup_task( [] );

		$this->assertArrayHasKey( 'clean_expired_store_entries', $result );
		$this->assertSame( 1, \count( $result ) );
	}
}
