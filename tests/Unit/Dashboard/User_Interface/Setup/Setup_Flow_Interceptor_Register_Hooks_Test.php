<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

/**
 * Test intercept_site_kit_setup_flow method.
 *
 * @group site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Flow_Interceptor::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Flow_Interceptor_Register_Hooks_Test extends Abstract_Setup_Flow_Interceptor_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			999,
			\has_action(
				'admin_init',
				[ $this->instance, 'intercept_site_kit_setup_flow' ]
			)
		);
	}
}
