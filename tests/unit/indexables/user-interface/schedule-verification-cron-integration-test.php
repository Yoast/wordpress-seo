<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Domain;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\User_Interface\Schedule_Verification_Cron_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Schedule_Verification_Cron_Integration_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\User_Interface\Schedule_Verification_Cron_Integration
 */
class Schedule_Verification_Cron_Integration_Test extends TestCase {

	/**
	 * @var \Yoast\WP\SEO\Indexables\User_Interface\Schedule_Verification_Cron_Integration
	 */
	private $instance;

	/**
	 * @var \Mockery\MockInterface|\Yoast\WP\SEO\Helpers\Options_Helper
	 */
	private $options_helper;

	/**
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

		$this->options_helper        = Mockery::mock( Options_Helper::class );
		$this->cron_schedule_handler = Mockery::mock( Verification_Cron_Schedule_Handler::class );

		$this->instance = new Schedule_Verification_Cron_Integration( $this->options_helper, $this->cron_schedule_handler );
	}

	/**
	 * Tests the register_hooks function.
	 *
	 * @covers ::register_hooks
	 * @return void
	 */
	public function test_register_hooks_ftc() {
		$this->options_helper->expects()->get( 'first_time_install', false )->andReturnFalse();

		Monkey\Functions\expect( 'add_action' )
			->with( 'wpseo_activate', [ $this->cron_schedule_handler, 'schedule_indexable_verification' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the register_hooks function.
	 *
	 * @covers ::register_hooks
	 * @return void
	 */
	public function test_register_hooks_without_ftc() {
		$this->options_helper->expects()->get( 'first_time_install', false )->andReturnTrue();
		Monkey\Functions\expect( 'add_action' )->never();
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
