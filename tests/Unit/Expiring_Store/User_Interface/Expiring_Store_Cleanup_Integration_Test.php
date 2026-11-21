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
		Monkey\Actions\expectAdded( 'admin_init' )
			->once()
			->with( [ $this->instance, 'schedule_cleanup' ] );

		Monkey\Actions\expectAdded( Expiring_Store_Cleanup_Integration::CRON_HOOK )
			->once()
			->with( [ $this->instance, 'run_cleanup' ] );

		Monkey\Actions\expectAdded( 'wpseo_deactivate' )
			->once()
			->with( [ $this->instance, 'unschedule_cleanup' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests schedule_cleanup schedules a weekly cron when none is scheduled yet.
	 *
	 * @covers ::schedule_cleanup
	 *
	 * @return void
	 */
	public function test_schedule_cleanup_when_not_scheduled() {
		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Expiring_Store_Cleanup_Integration::CRON_HOOK )
			->andReturn( false );

		Monkey\Functions\expect( 'wp_schedule_event' )
			->once()
			->with(
				Mockery::type( 'int' ),
				'weekly',
				Expiring_Store_Cleanup_Integration::CRON_HOOK,
			);

		$this->instance->schedule_cleanup();
	}

	/**
	 * Tests schedule_cleanup is a no-op when a cron is already scheduled.
	 *
	 * @covers ::schedule_cleanup
	 *
	 * @return void
	 */
	public function test_schedule_cleanup_when_already_scheduled() {
		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Expiring_Store_Cleanup_Integration::CRON_HOOK )
			->andReturn( 1_617_235_200 );

		Monkey\Functions\expect( 'wp_schedule_event' )->never();

		$this->instance->schedule_cleanup();
	}

	/**
	 * Tests unschedule_cleanup clears all scheduled events for the cron hook.
	 *
	 * @covers ::unschedule_cleanup
	 *
	 * @return void
	 */
	public function test_unschedule_cleanup() {
		Monkey\Functions\expect( 'wp_clear_scheduled_hook' )
			->once()
			->with( Expiring_Store_Cleanup_Integration::CRON_HOOK );

		$this->instance->unschedule_cleanup();
	}

	/**
	 * Tests run_cleanup delegates to the expiring store.
	 *
	 * @covers ::run_cleanup
	 *
	 * @return void
	 */
	public function test_run_cleanup() {
		$this->expiring_store->expects( 'cleanup_expired' )->once();

		$this->instance->run_cleanup();
	}
}
