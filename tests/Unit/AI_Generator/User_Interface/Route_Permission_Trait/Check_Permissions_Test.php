<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Route_Permission_Trait;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\AI_Generator\User_Interface\Route_Permission_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Route_Permission_Trait's check_permissions method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Route_Permission_Trait::check_permissions
 */
final class Check_Permissions_Test extends TestCase {

	use Route_Permission_Trait;

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

		Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		if ( $can_edit_posts ) {
			Functions\expect( 'user_can' )
				->once()
				->with( $user, 'edit_posts' )
				->andReturn( true );
		}

		$this->check_permissions();
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
