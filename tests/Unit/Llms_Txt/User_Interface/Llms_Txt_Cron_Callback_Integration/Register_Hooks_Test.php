<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Llms_Txt_Cron_Callback_Integration;

use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

/**
 * Tests the register_hooks.
 *
 * @group  llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Llms_Txt_Cron_Callback_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Llms_Txt_Cron_Callback_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			10,
			\has_action(
				Llms_Txt_Cron_Scheduler::LLMS_TXT_POPULATION,
				[ $this->instance, 'populate_file' ]
			)
		);
	}
}
