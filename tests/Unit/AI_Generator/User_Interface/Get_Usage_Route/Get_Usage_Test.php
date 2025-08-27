<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Get_Usage_Route;

use Brain\Monkey\Functions;
use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use WP_User;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

/**
 * Tests the Get_Usage_Route's get_usage method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route::get_usage
 */
final class Get_Usage_Test extends Abstract_Get_Usage_Route_Test {

	/**
	 * Tests the get_usage method.
	 *
	 * @return void
	 */
	public function test_get_usage() {
		$user = Mockery::mock( WP_User::class );

		Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'is_woo_product_entity' )
			->andReturn( true );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$http_response    = Mockery::mock( Response::class );

		$this->token_manager
			->expects( 'get_or_request_access_token' )
			->once()
			->with( $user );

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true );

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andReturn( $http_response );

		$http_response
			->expects( 'get_body' )
			->once()
			->withNoArgs()
			->andReturn( '' );

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with( [] );

		$result = $this->instance->get_usage( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests a bad HTTP request.
	 *
	 * @return void
	 */
	public function test_get_usage_with_bad_http_request() {
		$user = Mockery::mock( WP_User::class );

		Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'is_woo_product_entity' )
			->andReturn( true );

		$wp_rest_response  = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$request_exception = Mockery::mock( Remote_Request_Exception::class );

		$this->token_manager
			->expects( 'get_or_request_access_token' )
			->once()
			->with( $user )
			->andThrows( $request_exception );

		$request_exception
			->expects( 'get_error_identifier' )
			->once()
			->withNoArgs()
			->andReturn( 'test' );

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with(
				[
					'errorMessage'    => '',
					'errorIdentifier' => 'test',
					'errorCode'       => 0,
				],
				0
			);

		$result = $this->instance->get_usage( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
