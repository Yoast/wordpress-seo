<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\General\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Set_Opt_In_Seen_Test
 *
 * @group opt-in-route
 *
 * @covers \Yoast\WP\SEO\General\User_Interface\Opt_In_Route::set_opt_in_seen
 */
final class Set_Opt_In_Seen_Test extends TestCase {

	/**
	 * Tests setting opt-in notification as seen with valid key and privileged user.
	 *
	 * @return void
	 */
	public function test_set_opt_in_seen_with_valid_key_and_privileged_user() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		$user->add_cap( 'wpseo_manage_options' );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'POST', '/yoast/v1/seen-opt-in-notification' );
		$request->set_param( 'key', 'wpseo_seen_llm_txt_opt_in_notification' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 200, $response->status );
		$this->assertTrue( $response_data->success );
		$this->assertSame( 200, $response_data->status );

		$meta_value = \get_user_meta( $user->ID, 'wpseo_seen_llm_txt_opt_in_notification', true );

		$this->assertSame( $meta_value, '1' );
	}

	/**
	 * Tests setting opt-in notification as seen with invalid key.
	 *
	 * @return void
	 */
	public function test_set_opt_in_seen_with_invalid_key() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		$user->add_cap( 'wpseo_manage_options' );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'POST', '/yoast/v1/seen-opt-in-notification' );
		$request->set_param( 'key', 'invalid_key' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['code'], 'rest_invalid_param' );
	}

	/**
	 * Tests setting opt-in notification as seen with non-privileged user.
	 *
	 * @return void
	 */
	public function test_set_opt_in_seen_with_not_privileged_user() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'author' ] );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'POST', '/yoast/v1/seen-opt-in-notification' );
		$request->set_param( 'key', 'wpseo_seen_llm_txt_opt_in_notification' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( $response_data['code'], 'rest_forbidden' );
		$this->assertSame( $response_data['data']['status'], 403 );
	}

	/**
	 * Tests setting opt-in notification as seen without being logged in.
	 *
	 * @return void
	 */
	public function test_set_opt_in_seen_with_no_user() {
		\wp_set_current_user( 0 );

		$request = new WP_REST_Request( 'POST', '/yoast/v1/seen-opt-in-notification' );
		$request->set_param( 'key', 'wpseo_seen_llm_txt_opt_in_notification' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( $response_data['code'], 'rest_forbidden' );
		$this->assertSame( $response_data['data']['status'], 401 );
	}

	/**
	 * Tests setting opt-in notification as seen with empty key.
	 *
	 * @return void
	 */
	public function test_set_opt_in_seen_with_empty_key() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		$user->add_cap( 'wpseo_manage_options' );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'POST', '/yoast/v1/seen-opt-in-notification' );
		$request->set_param( 'key', '' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['code'], 'rest_invalid_param' );
	}

	/**
	 * Tests setting opt-in notification as seen without key parameter.
	 *
	 * @return void
	 */
	public function test_set_opt_in_seen_without_key_parameter() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		$user->add_cap( 'wpseo_manage_options' );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'POST', '/yoast/v1/seen-opt-in-notification' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['code'], 'rest_missing_callback_param' );
	}
}
