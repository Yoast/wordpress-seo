<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\General\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\General\User_Interface\Opt_In_Route;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
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
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Manually register the route for testing.
		\add_action(
			'rest_api_init',
			static function () {
				$user_helper       = new User_Helper();
				$capability_helper = new Capability_Helper();
				$opt_in_route      = new Opt_In_Route( $user_helper, $capability_helper );
				$opt_in_route->register_routes();
			}
		);

		// Trigger the rest_api_init action to register routes.
		\do_action( 'rest_api_init' );
	}

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
		$request->set_param( 'key', 'task_list' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 200, $response->status );
		$this->assertTrue( $response_data->success );
		$this->assertSame( 200, $response_data->status );

		$meta_value = \get_user_meta( $user->ID, '_yoast_wpseo_task_list_opt_in_notification_seen', true );

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
		$request->set_param( 'key', 'task_list' );

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
		$request->set_param( 'key', 'task_list' );

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
