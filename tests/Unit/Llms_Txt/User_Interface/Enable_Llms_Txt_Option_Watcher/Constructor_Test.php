<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;

use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

/**
 * Tests the constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher::__construct
 */
final class Constructor_Test extends Abstract_Enable_Llms_Txt_Option_Watcher_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Llms_Txt_Cron_Scheduler::class,
			$this->getPropertyValue( $this->instance, 'scheduler' )
		);
		$this->assertInstanceOf(
			Remove_File_Command_Handler::class,
			$this->getPropertyValue( $this->instance, 'remove_file_command_handler' )
		);
		$this->assertInstanceOf(
			Populate_File_Command_Handler::class,
			$this->getPropertyValue( $this->instance, 'populate_file_command_handler' )
		);
	}
}
