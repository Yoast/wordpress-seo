<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Outline_Route;

use Brain\Monkey\Functions;
use Mockery;
use stdClass;
use WP_REST_Request;
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
	 * Builds a request whose `post_type` parameter returns the given value.
	 *
	 * @param string $post_type The post type to return from get_param.
	 *
	 * @return Mockery\MockInterface|WP_REST_Request The request mock.
	 */
	private function build_request( string $post_type ) {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'post_type' )->andReturn( $post_type );

		return $request;
	}

	/**
	 * Builds a fake post-type object whose cap->edit_posts is the given capability.
	 *
	 * @param string $edit_posts_cap The edit_posts capability for this post type.
	 *
	 * @return stdClass The post-type object.
	 */
	private function build_post_type_object( string $edit_posts_cap ): stdClass {
		$post_type_object                  = new stdClass();
		$post_type_object->cap             = new stdClass();
		$post_type_object->cap->edit_posts = $edit_posts_cap;

		return $post_type_object;
	}

	/**
	 * Tests check_permissions returns false for an anonymous user without inspecting the request.
	 *
	 * @return void
	 */
	public function test_check_permissions_anonymous_user() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 0;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );

		$request = Mockery::mock( WP_REST_Request::class );

		$this->assertFalse( $this->instance->check_permissions( $request ) );
	}

	/**
	 * Tests check_permissions returns false when the requested post type does not exist.
	 *
	 * @return void
	 */
	public function test_check_permissions_unknown_post_type() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );
		Functions\when( 'get_post_type_object' )->justReturn( null );

		$this->assertFalse( $this->instance->check_permissions( $this->build_request( 'does_not_exist' ) ) );
	}

	/**
	 * Tests check_permissions returns true when the user holds the post-type-specific edit_posts cap.
	 *
	 * @return void
	 */
	public function test_check_permissions_user_with_post_type_cap() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );
		Functions\when( 'get_post_type_object' )->justReturn( $this->build_post_type_object( 'edit_pages' ) );
		Functions\expect( 'user_can' )->with( $user, 'edit_pages' )->andReturn( true );

		$this->assertTrue( $this->instance->check_permissions( $this->build_request( 'page' ) ) );
	}

	/**
	 * Tests check_permissions returns false when the user lacks the post-type-specific edit_posts cap.
	 *
	 * @return void
	 */
	public function test_check_permissions_user_without_post_type_cap() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );
		Functions\when( 'get_post_type_object' )->justReturn( $this->build_post_type_object( 'edit_pages' ) );
		Functions\expect( 'user_can' )->with( $user, 'edit_pages' )->andReturn( false );

		$this->assertFalse( $this->instance->check_permissions( $this->build_request( 'page' ) ) );
	}
}
