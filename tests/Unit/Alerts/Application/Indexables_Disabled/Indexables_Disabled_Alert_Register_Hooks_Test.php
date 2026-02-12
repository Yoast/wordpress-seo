<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Indexables_Disabled;

/**
 * Test class for registering hooks.
 *
 * @group Indexables_Disabled
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Indexables_Disabled\Indexables_Disabled_Alert::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Indexables_Disabled_Alert_Register_Hooks_Test extends Abstract_Indexables_Disabled_Alert_Test {

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
				[ $this->instance, 'add_notifications' ]
			)
		);
	}
}
