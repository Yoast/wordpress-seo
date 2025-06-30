<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;

/**
 * Tests the register_hooks.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Enable_Llms_Txt_Option_Watcher_Test {

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
				'update_option_wpseo',
				[ $this->instance, 'check_toggle_llms_txt' ]
			)
		);
	}
}
