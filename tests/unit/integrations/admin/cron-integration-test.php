<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Integrations\Admin\Cron_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Cron_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Cron_Integration
 * @covers \Yoast\WP\SEO\Integrations\Admin\Cron_Integration
 *
 * @group integrations
 */
class Cron_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Cron_Integration
	 */
	protected $instance;

	protected $date_helper;

	public function setUp() {
		parent::setUp();

		$this->date_helper = Mockery::mock( Date_Helper::class );
		$this->instance    = new Cron_Integration( $this->date_helper );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Admin_Conditional::class,
			],
			Cron_Integration::get_conditionals()
		);
	}

	/**
	 * Tests if the required dependencies are set right.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertAttributeInstanceOf( Date_Helper::class, 'date_helper', $this->instance );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 123456 );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Indexing_Notification_Integration::NOTIFICATION_ID )
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_schedule_event' )
			->once()
			->with( 123456, 'daily', Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->register_hooks();
	}
}
