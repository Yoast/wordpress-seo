<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;

/**
 * Class Perform_Request_Post_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client::perform_request
 */
final class Perform_Request_Post_Test extends Abstract_API_Client_Test {

	/**
	 * Tests the perform_request method with a POST request.
	 *
	 * @return void
	 */
	public function test_perform_request_post() {
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

		$expected_args = [
			'timeout' => 60,
			'headers' => [
				'Authorization' => 'Bearer test_token',
				'Content-Type'  => 'application/json',
			],
			'body'    => '{"prompt":"Test prompt"}',
		];

		Functions\expect( 'wp_remote_post' )
			->once()
			->with( 'https://ai.yoa.st/api/v1/generate', $expected_args )
			->andReturn(
				[
					'body'     => '{"success":true}',
					'response' => [ 'code' => 200 ],
				]
			);

		$result = $this->instance->perform_request( $action_path, $body, $headers, $is_post );

		$this->assertEquals(
			[
				'body'     => '{"success":true}',
				'response' => [ 'code' => 200 ],
			],
			$result
		);
	}
}
