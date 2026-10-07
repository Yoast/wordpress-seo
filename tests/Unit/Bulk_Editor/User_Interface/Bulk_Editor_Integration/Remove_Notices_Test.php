<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Functions;

/**
 * Tests removing notices in the admin header.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::remove_notices
 */
final class Remove_Notices_Test extends Abstract_Test {

	/**
	 * Tests removing notices in the admin header.
	 *
	 * @return void
	 */
	public function test_remove_notices() {
		Functions\expect( 'remove_all_actions' )->once()->with( 'admin_notices' );
		Functions\expect( 'remove_all_actions' )->once()->with( 'user_admin_notices' );
		Functions\expect( 'remove_all_actions' )->once()->with( 'network_admin_notices' );
		Functions\expect( 'remove_all_actions' )->once()->with( 'all_admin_notices' );

		$this->instance->remove_notices();
	}
}
