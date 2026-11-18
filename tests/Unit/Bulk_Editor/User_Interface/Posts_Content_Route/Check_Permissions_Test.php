<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Content_Route;

use Brain\Monkey\Functions;

/**
 * Tests check_permissions.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Content_Route::check_permissions
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Check_Permissions_Test extends Abstract_Posts_Content_Route_Test {

	/**
	 * Tests that the bulk editor capability is required.
	 *
	 * @param bool $can      Whether the current user has the capability.
	 * @param bool $expected The expected result.
	 *
	 * @dataProvider data_check_permissions
	 *
	 * @return void
	 */
	public function test_check_permissions( bool $can, bool $expected ) {
		Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $can );

		$this->assertSame( $expected, $this->instance->check_permissions() );
	}

	/**
	 * Data provider for test_check_permissions.
	 *
	 * @return array<string, array<bool>>
	 */
	public static function data_check_permissions() {
		return [
			'allowed'     => [ true, true ],
			'not allowed' => [ false, false ],
		];
	}
}
