<?php
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
	 * Tests the handle method with different response codes.
	 *
	 * @param int         $response_code The response code.
	 * @param string      $message       The error message.
	 * @param string|null $error_code    The error code.
	 *
	 * @dataProvider provider_handle
	 *
	 * @return void
	 */
	public function test_handle( $response_code, $message, $error_code ) {

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

		if ( $response_code === 200 ) {
			$result = $this->instance->handle( $request );
			$this->assertSame( $response, $result );
			return;
		}

		switch ( $response_code ) {
			case 401:
				$this->expectException( Unauthorized_Exception::class );
				break;
			case 402:
				$this->expectException( Payment_Required_Exception::class );
				break;
			case 403:
				$this->expectException( Forbidden_Exception::class );
				break;
			case 404:
				$this->expectException( Not_Found_Exception::class );
				break;
			case 408:
				$this->expectException( Request_Timeout_Exception::class );
				break;
			case 429:
				$this->expectException( Too_Many_Requests_Exception::class );
				break;
			case 500:
				$this->expectException( Internal_Server_Error_Exception::class );
				break;
			case 503:
				$this->expectException( Service_Unavailable_Exception::class );
				break;
			default:
				$this->expectException( Bad_Request_Exception::class );
				break;
		}

		$this->instance->handle( $request );
	}

	/**
	 * Data provider for test_handle.
	 *
	 * @return array<array<string, int|string|null>>
	 */
	public function provider_handle() {
		return [
			'successful_response' => [
				'response_code' => 200,
				'message'       => 'Success',
				'error_code'    => null,
			],
			'unauthorized' => [
				'response_code' => 401,
				'message'       => 'Unauthorized',
				'error_code'    => 'auth_error',
			],
			'payment_required' => [
				'response_code' => 402,
				'message'       => 'Payment Required',
				'error_code'    => 'payment_needed',
			],
			'forbidden' => [
				'response_code' => 403,
				'message'       => 'Forbidden',
				'error_code'    => 'access_denied',
			],
			'not_found' => [
				'response_code' => 404,
				'message'       => 'Not Found',
				'error_code'    => 'resource_not_found',
			],
			'request_timeout' => [
				'response_code' => 408,
				'message'       => 'Request Timeout',
				'error_code'    => 'timeout',
			],
			'too_many_requests' => [
				'response_code' => 429,
				'message'       => 'Too Many Requests',
				'error_code'    => 'rate_limit',
			],
			'internal_server_error' => [
				'response_code' => 500,
				'message'       => 'Internal Server Error',
				'error_code'    => 'server_error',
			],
			'service_unavailable' => [
				'response_code' => 503,
				'message'       => 'Service Unavailable',
				'error_code'    => 'service_down',
			],
			'bad_request' => [
				'response_code' => 400,
				'message'       => 'Bad Request',
				'error_code'    => 'invalid_request',
			],
		];
	}
}
