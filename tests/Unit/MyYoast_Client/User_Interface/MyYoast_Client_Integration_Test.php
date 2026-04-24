<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\MyYoast_Client_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the MyYoast_Client_Integration class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\User_Interface\MyYoast_Client_Integration
 */
final class MyYoast_Client_Integration_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var MyYoast_Client_Integration
	 */
	private $instance;

	/**
	 * The registration manager mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );
		$this->instance            = new MyYoast_Client_Integration( $this->client_registration );
	}

	/**
	 * Tests that get_conditionals returns an empty array.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [], MyYoast_Client_Integration::get_conditionals() );
	}

	/**
	 * Tests that register_hooks registers the expected hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Functions\expect( 'add_action' )
			->with( 'admin_init', [ $this->instance, 'schedule_key_rotation' ] )
			->once();

		Functions\expect( 'add_action' )
			->with( 'Yoast\WP\SEO\myyoast_key_rotation', [ $this->instance, 'handle_key_rotation' ] )
			->once();

		Functions\expect( 'add_filter' )
			->with( 'cron_schedules', [ $this->instance, 'add_cron_schedule' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that add_cron_schedule adds the 90-day interval.
	 *
	 * @covers ::add_cron_schedule
	 *
	 * @return void
	 */
	public function test_add_cron_schedule() {
		$schedules = $this->instance->add_cron_schedule( [] );

		$this->assertArrayHasKey( 'Yoast\WP\SEO\myyoast_90days', $schedules );
		$this->assertSame( ( 90 * 86_400 ), $schedules['Yoast\WP\SEO\myyoast_90days']['interval'] );
	}

	/**
	 * Tests that schedule_key_rotation schedules when not already scheduled.
	 *
	 * @covers ::schedule_key_rotation
	 *
	 * @return void
	 */
	public function test_schedule_key_rotation() {
		Functions\expect( 'wp_next_scheduled' )
			->with( 'Yoast\WP\SEO\myyoast_key_rotation' )
			->andReturn( false );

		Functions\expect( 'wp_schedule_event' )->once();

		$this->instance->schedule_key_rotation();
	}

	/**
	 * Tests that handle_key_rotation delegates to client_registration.
	 *
	 * @covers ::handle_key_rotation
	 *
	 * @return void
	 */
	public function test_handle_key_rotation() {
		$this->client_registration
			->expects( 'rotate_registration_keys' )
			->once();

		$this->instance->handle_key_rotation();
	}
}
