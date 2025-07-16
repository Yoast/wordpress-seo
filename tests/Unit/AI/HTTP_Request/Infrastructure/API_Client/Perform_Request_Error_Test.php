<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use function Brain\Monkey\Functions;

/**
 * Class Perform_Request_Error_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client::perform_request
 */
final class Perform_Request_Error_Test extends Abstract_API_Client_Test {

	/**
	 * Tests the perform_request method when wp_remote_post returns an error.
	 *
	 * @return void
	 */
	public function test_perform_request_error() {
		$action_path = '/generate';
		$body        = [ 'prompt' => 'Test prompt' ];
		$headers     = [ 'Authorization' => 'Bearer test_token' ];
		$is_post     = true;

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_api_url', 'https://ai.yoa.st/api/v1' )
			->andReturn( 'https://ai.yoa.st/api/v1' );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_suggestions_timeout', 60 )
			->andReturn( 60 );

		$wp_error = Mockery::mock( 'WP_Error' );
		$wp_error->shouldReceive( 'get_error_message' )
			->once()
			->andReturn( 'WP_HTTP_REQUEST_ERROR' );

		$wp_error->shouldReceive( 'get_error_code' )
			->zeroOrMoreTimes()
			->andReturn( 500 );

		Functions\expect( 'is_wp_error' )
			->once()
			->andReturn( true );

		Functions\expect( 'wp_remote_post' )
			->once()
			->andReturn( $wp_error );

		$this->expectException( WP_Request_Exception::class );
		$this->expectExceptionMessage( 'WP_HTTP_REQUEST_ERROR' );

		$this->instance->perform_request( $action_path, $body, $headers, $is_post );
	}
}
