<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

/**
 * Test class for WPSEO_Suggested_Plugins::register_hooks.
 *
 * @covers WPSEO_Suggested_Plugins::register_hooks
 */
final class Suggested_Plugins_Register_Hooks_Test extends Suggested_Plugins_TestCase {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers WPSEO_Suggested_Plugins::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			10,
			\has_action(
				'admin_init',
				[ $this->availability_checker, 'register' ]
			)
		);

		$this->assertEquals(
			10,
			\has_action(
				'admin_init',
				[ $this->instance, 'add_notifications' ]
			)
		);
	}
}
