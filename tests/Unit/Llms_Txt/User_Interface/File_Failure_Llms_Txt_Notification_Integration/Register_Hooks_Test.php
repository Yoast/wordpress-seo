<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration;

/**
 * Tests the File_Failure_Llms_Txt_Notification_Integration register_hooks.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_File_Failure_Llms_Txt_Notification_Integration_Test {

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
				'admin_init',
				[ $this->instance, 'maybe_show_notification' ]
			)
		);
	}
}
