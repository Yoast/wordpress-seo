<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Class Perform_Request_Delete_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client::perform_request
 */
final class Perform_Request_Delete_Test extends Abstract_API_Client_Test {

	/**
	 * Tests the perform_request method with a DELETE request.
	 *
	 * @return void
	 */
	public function test_perform_request_delete() {
		$action_path = '/user/consent';
		$body        = [];
		$headers     = [ 'Authorization' => 'Bearer test_token' ];
		$http_method = Request::METHOD_DELETE;

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_api_url', 'https://ai.yoa.st/api/v1' )
			->andReturn( 'https://ai.yoa.st/api/v1' );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_suggestions_timeout', 60 )
			->andReturn( 60 );

		$expected_args = [
			'timeout' => 60,
			'headers' => [
				'Authorization' => 'Bearer test_token',
				'Content-Type'  => 'application/json',
			],
			'method'  => 'DELETE',
		];

		Functions\expect( 'wp_remote_request' )
			->once()
			->with( 'https://ai.yoa.st/api/v1/user/consent', $expected_args )
			->andReturn(
				[
					'body'     => '',
					'response' => [ 'code' => 200 ],
				],
			);

		$result = $this->instance->perform_request( $action_path, $body, $headers, $http_method );

		$this->assertEquals(
			[
				'body'     => '',
				'response' => [ 'code' => 200 ],
			],
			$result,
		);
	}
}
