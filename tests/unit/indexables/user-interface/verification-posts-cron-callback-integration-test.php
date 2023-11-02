<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\User_Interface\Mark_Deactivation_Integration;
use Yoast\WP\SEO\Indexables\User_Interface\Verification_No_Timestamp_Cron_Callback_Integration;
use Yoast\WP\SEO\Indexables\User_Interface\Verification_Posts_Cron_Callback_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Verification_Posts_Cron_Callback_Integration_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\User_Interface\Verification_Posts_Cron_Callback_Integration
 */
class Verification_Posts_Cron_Callback_Integration_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Verification_Posts_Cron_Callback_Integration
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var \Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The cron schedule handler.
	 *
	 * @var \Mockery\MockInterface|Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;

	/**
	 * The cron verification gate.
	 *
	 * @var \Mockery\MockInterface|Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * The verification cron batch handler.
	 *
	 * @var \Mockery\MockInterface|Verification_Cron_Batch_Handler
	 */
	private $verification_cron_batch_handler;

	/**
	 * The command handler.
	 *
	 * @var \Mockery\MockInterface|Verify_Post_Indexables_Command_Handler
	 */
	private $verify_posts_indexables_command_handler;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->cron_verification_gate                  = Mockery::mock( Cron_Verification_Gate::class );
		$this->cron_schedule_handler                   = Mockery::mock( Verification_Cron_Schedule_Handler::class );
		$this->options_helper                          = Mockery::mock( Options_Helper::class );
		$this->verification_cron_batch_handler         = Mockery::mock( Verification_Cron_Batch_Handler::class );
		$this->verify_posts_indexables_command_handler = Mockery::mock( Verify_Post_Indexables_Command_Handler::class );
		$this->instance                                = new Verification_Posts_Cron_Callback_Integration( $this->cron_verification_gate, $this->cron_schedule_handler, $this->options_helper, $this->verification_cron_batch_handler, $this->verify_posts_indexables_command_handler );
	}

	/**
	 * Tests the register_hooks function.
	 *
	 * @covers ::register_hooks
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Functions\expect( 'add_action' )
			->with(
				Verification_Cron_Schedule_Handler::INDEXABLE_VERIFY_POST_INDEXABLES_NAME,
				[
					$this->instance,
					'start_verify_posts',
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
			Verification_Posts_Cron_Callback_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the `start_verify_posts` when no cron is running and indexables are enabled.
	 *
	 * @covers ::start_verify_posts
	 *
	 * @return void
	 */
	public function test_start_verify_posts_indexables_indexables_disabled() {
		Monkey\Functions\expect( 'wp_doing_cron' )->andReturnTrue();
		$this->cron_verification_gate->expects( 'should_verify_on_cron' )->andReturnFalse();
		$this->cron_schedule_handler->expects( 'unschedule_verify_post_indexables_cron' )->once();
		$this->instance->start_verify_posts();
	}

	/**
	 * Tests the `start_verify_posts` in a normal flow.
	 *
	 * @covers ::start_verify_posts
	 *
	 * @return void
	 */
	public function test_start_verify_posts_indexables() {
		Monkey\Functions\expect( 'wp_doing_cron' )->andReturnTrue();
		$this->cron_verification_gate->expects( 'should_verify_on_cron' )->andReturnTrue();

		$this->verification_cron_batch_handler->expects( 'get_current_post_indexables_batch' )->andReturn( 10 );
		$this->verify_posts_indexables_command_handler->expects( 'handle' );

		$this->instance->start_verify_posts();
	}
}
