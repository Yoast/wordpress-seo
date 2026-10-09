<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Debug_Display;

/**
 * Test class for registering hooks.
 *
 * @group Debug_Display
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Debug_Display_Alert_Register_Hooks_Test extends Abstract_Debug_Display_Alert_Test {

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
				[ $this->instance, 'add_notifications' ],
			),
		);
	}
}
