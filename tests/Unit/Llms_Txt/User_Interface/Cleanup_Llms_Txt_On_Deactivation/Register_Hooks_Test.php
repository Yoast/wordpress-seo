<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;

/**
 * Tests the register_hooks.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Cleanup_Llms_Txt_On_Deactivation_Test {

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
				'wpseo_deactivate',
				[ $this->instance, 'maybe_remove_llms_file' ]
			)
		);
	}
}
