<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

/**
 * Test Setup_Url_Interceptor method.
 *
 * @group site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Url_Interceptor_Register_Hooks_Test extends Abstract_Setup_Url_Interceptor_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			10,
			\has_filter(
				'admin_menu',
				[ $this->instance, 'add_redirect_page' ]
			)
		);
		$this->assertEquals(
			1,
			\has_action(
				'admin_init',
				[ $this->instance, 'intercept_site_kit_setup_url_redirect' ]
			)
		);
	}
}
