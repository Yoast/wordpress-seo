<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Cleanup_Llms_Txt_On_Deactivation tests.
 *
 * @group llms.txt
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Cleanup_Llms_Txt_On_Deactivation_Test extends TestCase {

	/**
	 * The command handler mock.
	 *
	 * @var Remove_File_Command_Handler|Mockery\MockInterface
	 */
	protected $command_handler;

	/**
	 * The cron scheduler mock.
	 *
	 * @var Llms_Txt_Cron_Scheduler|Mockery\MockInterface
	 */
	protected $cron_scheduler;

	/**
	 * The instance under test.
	 *
	 * @var Cleanup_Llms_Txt_On_Deactivation
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->command_handler = Mockery::mock( Remove_File_Command_Handler::class );
		$this->cron_scheduler  = Mockery::mock( Llms_Txt_Cron_Scheduler::class );

		$this->instance = new Cleanup_Llms_Txt_On_Deactivation(
			$this->command_handler,
			$this->cron_scheduler
		);
	}
}
