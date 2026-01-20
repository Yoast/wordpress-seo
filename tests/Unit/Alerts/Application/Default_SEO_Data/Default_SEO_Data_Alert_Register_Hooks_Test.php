<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Default_SEO_Data;

/**
 * Test class for registering hooks.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Register_Hooks_Test extends Abstract_Default_SEO_Data_Alert_Test {

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
