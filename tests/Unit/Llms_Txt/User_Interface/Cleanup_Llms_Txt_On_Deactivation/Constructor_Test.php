<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;

use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

/**
 * Tests the contstructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation::__construct
 */
final class Constructor_Test extends Abstract_Cleanup_Llms_Txt_On_Deactivation_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Remove_File_Command_Handler::class,
			$this->getPropertyValue( $this->instance, 'command_handler' )
		);
		$this->assertInstanceOf(
			Llms_Txt_Cron_Scheduler::class,
			$this->getPropertyValue( $this->instance, 'cron_scheduler' )
		);
	}
}
