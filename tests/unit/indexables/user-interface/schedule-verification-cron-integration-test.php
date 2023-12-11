<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\User_Interface\Schedule_Verification_Cron_Integration;
use Yoast\WP\SEO\Indexables\User_Interface\Verification_No_Timestamp_Cron_Callback_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Schedule_Verification_Cron_Integration class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\User_Interface\Schedule_Verification_Cron_Integration
 */
class Schedule_Verification_Cron_Integration_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Schedule_Verification_Cron_Integration
	 */
	private $instance;

	/**
	 * The cron schedule handler.
	 *
	 * @var \Mockery\MockInterface|Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->cron_schedule_handler = Mockery::mock( Verification_Cron_Schedule_Handler::class );

		$this->instance = new Schedule_Verification_Cron_Integration( $this->cron_schedule_handler );
	}

	/**
	 * Tests the register_hooks function.
	 *
	 * @covers ::register_hooks
	 * @covers ::__construct
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Functions\expect( 'add_action' )
			->with(
				'wpseo_activate',
				[
					$this->cron_schedule_handler,
					'schedule_indexable_verification',
				]
			);

		$this->instance->register_hooks();
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_conditionals
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
			],
			Schedule_Verification_Cron_Integration::get_conditionals()
		);
	}
}
