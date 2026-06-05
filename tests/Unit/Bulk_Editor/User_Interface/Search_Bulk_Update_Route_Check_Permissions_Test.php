<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Brain\Monkey;

/**
 * Test class for check_permissions.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Abstract_Bulk_Update_Route::check_permissions
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Bulk_Update_Route_Check_Permissions_Test extends Abstract_Search_Bulk_Update_Route_Test {

	/**
	 * Tests the permission callback checks the wpseo_manage_options capability.
	 *
	 * @return void
	 */
	public function test_check_permissions() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->check_permissions() );
	}

	/**
	 * Tests the permission callback denies users without the wpseo_manage_options capability.
	 *
	 * @return void
	 */
	public function test_check_permissions_denied() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturnFalse();

		$this->assertFalse( $this->instance->check_permissions() );
	}
}
