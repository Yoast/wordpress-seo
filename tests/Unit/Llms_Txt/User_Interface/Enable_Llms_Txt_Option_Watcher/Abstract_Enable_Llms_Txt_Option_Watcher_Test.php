<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Enable_Llms_Txt_Option_Watcher tests.
 *
 * @group llms.txt
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Enable_Llms_Txt_Option_Watcher_Test extends TestCase {

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
	 * The populate file command handler mock.
	 *
	 * @var Populate_File_Command_Handler|Mockery\MockInterface
	 */
	protected $populate_file_command_handler;

	/**
	 * The instance under test.
	 *
	 * @var Cleanup_Llms_Txt_On_Deactivation
	 */
	protected $instance;

	/**
	 * The options helper mock.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->cron_scheduler                = Mockery::mock( Llms_Txt_Cron_Scheduler::class );
		$this->command_handler               = Mockery::mock( Remove_File_Command_Handler::class );
		$this->populate_file_command_handler = Mockery::mock( Populate_File_Command_Handler::class );
		$this->options_helper                = Mockery::mock( Options_Helper::class );

		$this->instance = new Enable_Llms_Txt_Option_Watcher(
			$this->cron_scheduler,
			$this->command_handler,
			$this->populate_file_command_handler,
			$this->options_helper
		);
	}
}
