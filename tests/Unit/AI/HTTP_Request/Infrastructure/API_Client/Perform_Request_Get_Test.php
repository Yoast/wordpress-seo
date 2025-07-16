<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Unit\AI\HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;
use function Brain\Monkey\Functions;

/**
 * Class Perform_Request_Get_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client::perform_request
 */
final class Perform_Request_Get_Test extends Abstract_API_Client_Test {

	/**
	 * Tests the perform_request method with a GET request.
	 *
	 * @return void
	 */
	public function test_perform_request_get() {
		$action_path = '/status';
		$body        = [];
		$headers     = [ 'Authorization' => 'Bearer test_token' ];
		$is_post     = false;

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
		];

		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://ai.yoa.st/api/v1/status', $expected_args )
			->andReturn(
				[
					'body'     => '{"status":"ok"}',
					'response' => [ 'code' => 200 ],
				]
			);

		$result = $this->instance->perform_request( $action_path, $body, $headers, $is_post );

		$this->assertEquals(
			[
				'body'     => '{"status":"ok"}',
				'response' => [ 'code' => 200 ],
			],
			$result
		);
	}
}
