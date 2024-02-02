<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\User_Interface;

use Brain\Monkey\Functions;
use Exception;
use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Introductions\User_Interface\Wistia_Embed_Permission_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Wistia embed permission route.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\User_Interface\Wistia_Embed_Permission_Route
 */
final class Wistia_Embed_Permission_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Wistia_Embed_Permission_Route
	 */
	private $instance;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * Holds the Wistia embed permissions repository.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $wistia_embed_permission_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		$this->wistia_embed_permission_repository = Mockery::mock( Wistia_Embed_Permission_Repository::class );
		$this->user_helper                        = Mockery::mock( User_Helper::class );

		$this->instance = new Wistia_Embed_Permission_Route( $this->wistia_embed_permission_repository, $this->user_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Wistia_Embed_Permission_Repository::class,
			$this->getPropertyValue( $this->instance, 'wistia_embed_permission_repository' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}

	/**
	 * Tests the get_conditionals function.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Wistia_Embed_Permission_Route::get_conditionals() );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/wistia_embed_permission',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_wistia_embed_permission' ],
						'permission_callback' => [ $this->instance, 'permission_edit_posts' ],
					],
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_wistia_embed_permission' ],
						'permission_callback' => [ $this->instance, 'permission_edit_posts' ],
						'args'                => [
							'value' => [
								'required' => false,
								'type'     => 'bool',
								'default'  => true,
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests that the capability that is tested for is `edit_posts`.
	 *
	 * @covers ::permission_edit_posts
	 *
	 * @return void
	 */
	public function test_permission_manage_options() {
		Functions\expect( 'current_user_can' )->once()->with( 'edit_posts' )->andReturn( true );

		$this->assertTrue( $this->instance->permission_edit_posts() );
	}

	/**
	 * Tests the get_wistia_embed_permission route's happy path.
	 *
	 * @covers ::get_wistia_embed_permission
	 *
	 * @return void
	 */
	public function test_get_wistia_embed_permission() {
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->wistia_embed_permission_repository
			->expects( 'get_value_for_user' )
			->once()
			->with( $user_id )
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
	 *
	 * @return void
	 */
	public function test_get_wistia_embed_permission_with_error() {
		$user_id = -1;
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->wistia_embed_permission_repository
			->expects( 'get_value_for_user' )
			->once()
			->with( $user_id )
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
	 *
	 * @return void
	 */
	public function test_set_wistia_embed_permission() {
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->wistia_embed_permission_repository
			->expects( 'set_value_for_user' )
			->once()
			->with( $user_id, true )
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
	 *
	 * @return void
	 */
	public function test_set_wistia_embed_permission_failed() {
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->wistia_embed_permission_repository
			->expects( 'set_value_for_user' )
			->once()
			->with( $user_id, true )
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
	 *
	 * @return void
	 */
	public function test_set_wistia_embed_permission_with_error() {
		$user_id = -1;
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->wistia_embed_permission_repository
			->expects( 'set_value_for_user' )
			->once()
			->with( $user_id, true )
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
}
