<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Unit\AI\Free_Sparks\User_Interface\Free_Sparks_Route;

use Brain\Monkey\Functions;
use Mockery;
use WP_User;
use function Brain\Monkey\Functions;

/**
 * Tests the Free_Sparks_Route's can_edit_posts method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI\Free_Sparks\User_Interface\Free_Sparks_Route::can_edit_posts
 */
final class Can_Edit_Posts_Test extends Abstract_Free_Sparks_Route_Test {

	/**
	 * Tests can_edit_posts returns false if no user is logged in.
	 *
	 * @return void
	 */
	public function test_can_edit_posts_returns_false_when_no_user() {
		Functions\expect( 'wp_get_current_user' )
			->once()
			->andReturn( null );

		$this->assertFalse( $this->instance->can_edit_posts() );
	}

	/**
	 * Tests can_edit_posts returns false if user ID < 1.
	 *
	 * @return void
	 */
	public function test_can_edit_posts_returns_false_when_user_id_less_than_1() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 0;
		Functions\expect( 'wp_get_current_user' )
			->once()
			->andReturn( $user );

		$this->assertFalse( $this->instance->can_edit_posts() );
	}

	/**
	 * Tests can_edit_posts returns true if user can edit posts.
	 *
	 * @return void
	 */
	public function test_can_edit_posts_returns_true_when_user_can_edit_posts() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 5;
		Functions\expect( 'wp_get_current_user' )
			->once()
			->andReturn( $user );
		Functions\expect( 'user_can' )
			->once()
			->with( $user, 'edit_posts' )
			->andReturn( true );

		$this->assertTrue( $this->instance->can_edit_posts() );
	}

	/**
	 * Tests can_edit_posts returns false if user cannot edit posts.
	 *
	 * @return void
	 */
	public function test_can_edit_posts_returns_false_when_user_cannot_edit_posts() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 5;
		Functions\expect( 'wp_get_current_user' )
			->once()
			->andReturn( $user );
		Functions\expect( 'user_can' )
			->once()
			->with( $user, 'edit_posts' )
			->andReturn( false );

		$this->assertFalse( $this->instance->can_edit_posts() );
	}
}
