<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\Consent_Route;

use Brain\Monkey;
use Mockery;
use WP_User;

/**
 * Tests the Consent_Route's check_permissions method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route::check_permissions
 */
final class Check_Permissions_Test extends Abstract_Consent_Route_Test {

	/**
	 * Tests the check_permissions method.
	 *
	 * @dataProvider data_check_permissions
	 *
	 * @param int  $user_id        The user ID to check.
	 * @param bool $can_edit_posts Whether the user can edit posts.
	 *
	 * @return void
	 */
	public function test_check_permissions( $user_id, $can_edit_posts ) {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = $user_id;

		Monkey\Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		if ( $can_edit_posts ) {
			Monkey\Functions\expect( 'user_can' )
				->once()
				->with( $user, 'edit_posts' )
				->andReturn( true );
		}

		$this->instance->check_permissions();
	}

	/**
	 * Data provider for test_check_permissions.
	 *
	 * @return array<array<int, bool>>
	 */
	public static function data_check_permissions() {
		return [
			'Logged out' => [ 0, false ],
			'Logged in'  => [ 1, true ],
		];
	}
}
