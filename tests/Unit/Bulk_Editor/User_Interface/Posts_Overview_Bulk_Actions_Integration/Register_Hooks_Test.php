<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

use Brain\Monkey\Actions;

/**
 * Tests the registration of the hooks.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Posts_Overview_Bulk_Actions_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Actions\expectAdded( 'admin_init' )->once()->with( [ $this->instance, 'register_bulk_actions' ] );

		$this->instance->register_hooks();
	}
}
