<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Exception;
use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Settings_Introduction_Action;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;
use Yoast\WP\SEO\Routes\Settings_Introduction_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Settings_Introduction_Route_Test class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Settings_Introduction_Route
 *
 * @group routes
 */
class Settings_Introduction_Route_Test extends TestCase {

	/**
	 * Represents the Settings_Introduction_Action.
	 *
	 * @var Mockery\MockInterface|Settings_Introduction_Action
	 */
	protected $settings_introduction_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var Settings_Introduction_Route
	 */
	protected $instance;

	/**
	 * {@inheritDoc}
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		$this->settings_introduction_action = Mockery::mock( Settings_Introduction_Action::class );
		$this->instance                     = new Settings_Introduction_Route( $this->settings_introduction_action );
	}

	/**
	 * Tests the get_conditionals function.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Settings_Conditional::class ], Settings_Introduction_Route::get_conditionals() );
	}

	/**
	 * Tests the permission_manage_options function.
	 *
	 * @covers ::permission_manage_options
	 */
	public function test_permission_manage_options() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->assertTrue( Settings_Introduction_Route::permission_manage_options() );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Settings_Introduction_Action::class,
			$this->getPropertyValue( $this->instance, 'settings_introduction_action' )
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/settings_introduction/wistia_embed_permission',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_wistia_embed_permission' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
					],
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_wistia_embed_permission' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
						'args'                => [
							'value' => [
								'required' => true,
								'type'     => 'bool',
							],
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/settings_introduction/show',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_show' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
					],
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_show' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
						'args'                => [
							'value' => [
								'required' => true,
								'type'     => 'bool',
							],
						],
					],
				]
			);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/settings_introduction/remove_notification',
					[
						[
							'methods'             => 'POST',
							'callback'            => [ $this->instance, 'remove_notification' ],
							'permission_callback' => [ $this->instance, 'permission_manage_options' ],
							'args'                => [
								'id' => [
									'required' => true,
									'type'     => 'string',
								],
							],
						],
					]
				);

		$this->instance->register_routes();
	}

	/**
	 * Tests the get_wistia_embed_permission route's happy path.
	 *
	 * @covers ::get_wistia_embed_permission
	 */
	public function test_get_wistia_embed_permission() {
		$this->settings_introduction_action
			->expects( 'get_wistia_embed_permission' )
			->withNoArgs()
			->once()
			->andReturnTrue();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'value' => true,
					],
				]
			)
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_wistia_embed_permission()
		);
	}

	/**
	 * Tests the get_wistia_embed_permission route with error.
	 *
	 * @covers ::get_wistia_embed_permission
	 */
	public function test_get_wistia_embed_permission_with_error() {
		$this->settings_introduction_action
			->expects( 'get_wistia_embed_permission' )
			->withNoArgs()
			->once()
			->andThrow( new Exception( 'Invalid User ID' ) );

		$this->assertInstanceOf(
			'WP_Error',
			$this->instance->get_wistia_embed_permission()
		);
	}

	/**
	 * Tests the set_wistia_embed_permission route's happy path.
	 *
	 * @covers ::set_wistia_embed_permission
	 */
	public function test_set_wistia_embed_permission() {
		$this->settings_introduction_action
			->expects( 'set_wistia_embed_permission' )
			->with( true )
			->once()
			->andReturnTrue();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => true,
					],
				],
				200
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'value' => true ] );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_wistia_embed_permission( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_wistia_embed_permission route that failed.
	 *
	 * @covers ::set_wistia_embed_permission
	 */
	public function test_set_wistia_embed_permission_failed() {
		$this->settings_introduction_action
			->expects( 'set_wistia_embed_permission' )
			->with( true )
			->once()
			->andReturnFalse();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => false,
					],
				],
				400
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'value' => true ] );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_wistia_embed_permission( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_wistia_embed_permission route with error.
	 *
	 * @covers ::set_wistia_embed_permission
	 */
	public function test_set_wistia_embed_permission_with_error() {
		$this->settings_introduction_action
			->expects( 'set_wistia_embed_permission' )
			->with( true )
			->once()
			->andThrow( new Exception( 'Invalid User ID' ) );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'value' => true ] );

		$this->assertInstanceOf(
			'WP_Error',
			$this->instance->set_wistia_embed_permission( $wp_rest_request )
		);
	}

	/**
	 * Tests the get_show route's happy path.
	 *
	 * @covers ::get_show
	 */
	public function test_get_show() {
		$this->settings_introduction_action
			->expects( 'get_show' )
			->withNoArgs()
			->once()
			->andReturnTrue();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'value' => true,
					],
				]
			)
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_show()
		);
	}

	/**
	 * Tests the get_show route with error.
	 *
	 * @covers ::get_show
	 */
	public function test_get_show_with_error() {
		$this->settings_introduction_action
			->expects( 'get_show' )
			->withNoArgs()
			->once()
			->andThrow( new Exception( 'Invalid User ID' ) );

		$this->assertInstanceOf(
			'WP_Error',
			$this->instance->get_show()
		);
	}

	/**
	 * Tests the set_show route's happy path.
	 *
	 * @covers ::set_show
	 */
	public function test_set_show() {
		$this->settings_introduction_action
			->expects( 'set_show' )
			->with( true )
			->once()
			->andReturnTrue();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => true,
					],
				],
				200
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'value' => true ] );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_show( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_show route that failed.
	 *
	 * @covers ::set_show
	 */
	public function test_set_show_failed() {
		$this->settings_introduction_action
			->expects( 'set_show' )
			->with( true )
			->once()
			->andReturnFalse();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => false,
					],
				],
				400
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'value' => true ] );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_show( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_show route with error.
	 *
	 * @covers ::set_show
	 */
	public function test_set_show_with_error() {
		$this->settings_introduction_action
			->expects( 'set_show' )
			->with( true )
			->once()
			->andThrow( new Exception( 'Invalid User ID' ) );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'value' => true ] );

		$this->assertInstanceOf(
			'WP_Error',
			$this->instance->set_show( $wp_rest_request )
		);
	}

	/**
	 * Tests the remove_notification route.
	 *
	 * @dataProvider remove_notification_dataprovider
	 *
	 * @covers ::remove_notification
	 *
	 * @param bool $return_value The return value of the remove_notification method.
	 * @param bool $success      The expected success value.
	 * @param int  $code         The expected code value.
	 */
	public function test_remove_notification( $return_value, $success, $code ) {
		$this->settings_introduction_action
			->expects( 'remove_notification' )
			->with( 'dummy-id' )
			->once()
			->andReturn( $return_value );

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => $success,
					],
				],
				$code
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( [ 'id' => 'dummy-id' ] );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->remove_notification( $wp_rest_request )
		);
	}

	/**
	 * Dataprovider for test_remove_notification.
	 *
	 * @covers ::remove_notification
	 */
	public function remove_notification_dataprovider() {
		return [
			[ true, true, 200 ],
			[ false, false, 400 ],
		];
	}
}
