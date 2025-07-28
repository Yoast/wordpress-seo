<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Application\Request_Handler;

use Mockery;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

/**
 * Class Handle_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler::handle
 */
final class Handle_Test extends Abstract_Request_Handler_Test {

	/**
	 * Tests the handle method with success response code.
	 *
	 * @return void
	 */
	public function test_handle_success() {
		$expect = $this->expect_request_response( 200, 'Success', null );

		$result = $this->instance->handle( $expect['request'] );
		$this->assertSame( $expect['response'], $result );
	}

	/**
	 * Tests the handle method with error response codes.
	 *
	 * @param int         $response_code The response code.
	 * @param string      $message       The error message.
	 * @param string|null $error_code    The error code.
	 * @param string|null $exception     The expected exception class.
	 *
	 * @dataProvider provider_handle
	 *
	 * @return void
	 */
	public function test_handle_error( $response_code, $message, $error_code, $exception ) {

		$expect = $this->expect_request_response( $response_code, $message, $error_code );

		$this->expectException( $exception );
		$this->expectExceptionMessage( $message );
		$this->expectExceptionCode( $response_code );

		$this->instance->handle( $expect['request'] );
	}

	/**
	 * Data provider for test_handle.
	 *
	 * @return array<array<string, int|string|null>>
	 */
	public function provider_handle() {
		return [
			'unauthorized' => [
				'response_code' => 401,
				'message'       => 'Unauthorized',
				'error_code'    => 'auth_error',
				'exception'     => Unauthorized_Exception::class,
			],
			'payment_required' => [
				'response_code' => 402,
				'message'       => 'Payment Required',
				'error_code'    => 'payment_needed',
				'exception'     => Payment_Required_Exception::class,
			],
			'forbidden' => [
				'response_code' => 403,
				'message'       => 'Forbidden',
				'error_code'    => 'access_denied',
				'exception'     => Forbidden_Exception::class,
			],
			'not_found' => [
				'response_code' => 404,
				'message'       => 'Not Found',
				'error_code'    => 'resource_not_found',
				'exception'     => Not_Found_Exception::class,
			],
			'request_timeout' => [
				'response_code' => 408,
				'message'       => 'Request Timeout',
				'error_code'    => 'timeout',
				'exception'     => Request_Timeout_Exception::class,
			],
			'too_many_requests' => [
				'response_code' => 429,
				'message'       => 'Too Many Requests',
				'error_code'    => 'rate_limit',
				'exception'     => Too_Many_Requests_Exception::class,
			],
			'internal_server_error' => [
				'response_code' => 500,
				'message'       => 'Internal Server Error',
				'error_code'    => 'server_error',
				'exception'     => Internal_Server_Error_Exception::class,
			],
			'service_unavailable' => [
				'response_code' => 503,
				'message'       => 'Service Unavailable',
				'error_code'    => 'service_down',
				'exception'     => Service_Unavailable_Exception::class,
			],
			'bad_request' => [
				'response_code' => 400,
				'message'       => 'Bad Request',
				'error_code'    => 'invalid_request',
				'exception'     => Bad_Request_Exception::class,
			],
		];
	}

	/**
	 * Mock and expects request and response for testing.
	 *
	 * @param int    $response_code The response code to mock.
	 * @param string $message       The message to mock.
	 * @param string $error_code    The error code to mock.
	 *
	 * @return array<string, Request|Response>
	 */
	private function expect_request_response( $response_code, $message, $error_code ) {
		$request = Mockery::mock( Request::class );
		$request->shouldReceive( 'get_action_path' )->andReturn( '/test' );
		$request->shouldReceive( 'get_body' )->andReturn( [ 'data' => 'test' ] );
		$request->shouldReceive( 'get_headers' )->andReturn( [ 'Authorization' => 'Bearer token' ] );
		$request->shouldReceive( 'is_post' )->andReturn( true );

		$response = Mockery::mock( Response::class );
		$response->shouldReceive( 'get_response_code' )->andReturn( $response_code );
		$response->shouldReceive( 'get_message' )->andReturn( $message );
		$response->shouldReceive( 'get_error_code' )->andReturn( $error_code );
		$response->shouldReceive( 'get_missing_licenses' )->andReturn( [] );

		$this->api_client->expects( 'perform_request' )
			->once()
			->andReturn( [ 'some_api_response' ] );

		$this->response_parser->expects( 'parse' )
			->once()
			->with( [ 'some_api_response' ] )
			->andReturn( $response );

		return [
			'request'  => $request,
			'response' => $response,
		];
	}
}
