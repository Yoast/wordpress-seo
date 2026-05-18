<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Outline_Route;

use Brain\Monkey\Functions;
use Mockery;
use WP_User;

/**
 * Tests the Get_Outline_Route check_permissions method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route::check_permissions
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Check_Permissions_Test extends Abstract_Get_Outline_Route_Test {

	/**
	 * Tests check_permissions returns false for an anonymous user.
	 *
	 * @return void
	 */
	public function test_check_permissions_anonymous_user() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 0;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );

		$this->assertFalse( $this->instance->check_permissions() );
	}

	/**
	 * Tests check_permissions returns true for a logged-in user with the edit_posts capability.
	 *
	 * @return void
	 */
	public function test_check_permissions_logged_in_user_with_edit_posts() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );
		Functions\when( 'user_can' )->justReturn( true );

		$this->assertTrue( $this->instance->check_permissions() );
	}

	/**
	 * Tests check_permissions returns false for a logged-in user without the edit_posts capability.
	 *
	 * @return void
	 */
	public function test_check_permissions_logged_in_user_without_edit_posts() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );
		Functions\when( 'user_can' )->justReturn( false );

		$this->assertFalse( $this->instance->check_permissions() );
	}
}
