<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Application\Response_Parser;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Parse_Test
 *
 * @group ai-http-request
 *
 * @covers \Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser
 */
final class Parse_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Response_Parser
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->instance = new Response_Parser();
	}

	/**
	 * Tests the parse method with various response scenarios.
	 *
	 * @param int           $response_code    The HTTP response code.
	 * @param string        $response_message The HTTP response message.
	 * @param string        $error_code       The expected error code.
	 * @param array<string> $missing_licenses The expected missing licenses.
	 * @param string        $response_body    The response body.
	 *
	 * @dataProvider provider_test_parse
	 *
	 * @return void
	 */
	public function test_parse( $response_code, $response_message, $error_code, $missing_licenses, $response_body ) {
		$response = [
			'body'     => $response_body,
			'response' => [
				'code'    => $response_code,
				'message' => $response_message,
			],
		];

		Functions\expect( 'wp_remote_retrieve_response_code' )
			->times( 2 )
			->with( $response )
			->andReturn( $response_code );

		Functions\expect( 'wp_remote_retrieve_response_message' )
			->once()
			->with( $response )
			->andReturn( $response_message );

		Functions\expect( 'esc_html' )
			->once()
			->with( $response_message )
			->andReturn( $response_message );

		if ( $response_code !== 200 && $response_code !== 0 ) {
			Functions\expect( 'wp_remote_retrieve_body' )
				->once()
				->with( $response )
				->andReturn( $response_body );
		}

		$result = $this->instance->parse( $response );

		$this->assertInstanceOf( Response::class, $result );
		$this->assertSame( $response['body'], $result->get_body() );
		$this->assertSame( $response_code, $result->get_response_code() );
		$this->assertSame( $response_message, $result->get_message() );
		$this->assertSame( $error_code, $result->get_error_code() );
		$this->assertSame( $missing_licenses, $result->get_missing_licenses() );
	}

	/**
	 * Data provider for test_parse.
	 *
	 * @return array<array<string, int|string|array<string>|null>>
	 */
	public function provider_test_parse() {
		return [
			'success_response' => [
				'response_code'    => 200,
				'response_message' => 'OK',
				'error_code'       => '',
				'missing_licenses' => [],
				'response_body'    => '{"data":"success"}',
			],
			'zero_response_code' => [
				'response_code'    => 0,
				'response_message' => '',
				'error_code'       => '',
				'missing_licenses' => [],
				'response_body'    => '',
			],
			'error_with_json_body_and_message_error_code' => [
				'response_code'    => 400,
				'response_message' => 'Invalid input provided',
				'error_code'       => 'UNKNOWN',
				'missing_licenses' => [],
				'response_body'    => '{"message":"Invalid input provided","error_code":"UNKNOWN"}',
			],
			'error_with_json_body_no_message_error_code' => [
				'response_code'    => 400,
				'response_message' => 'Bad Request',
				'error_code'       => 'UNKNOWN',
				'missing_licenses' => [],
				'response_body'    => '{"other":"value"}',
			],
			'payment_required_with_missing_licenses' => [
				'response_code'    => 402,
				'response_message' => 'Payment required',
				'error_code'       => 'PAYMENT_REQUIRED',
				'missing_licenses' => [ 'premium' ],
				'response_body'    => '{"message":"Payment required","error_code":"PAYMENT_REQUIRED","missing_licenses":["premium"]}',
			],
			'payment_required_without_missing_licenses' => [
				'response_code'    => 402,
				'response_message' => 'Payment required',
				'error_code'       => 'PAYMENT_REQUIRED',
				'missing_licenses' => [],
				'response_body'    => '{"message":"Payment required","error_code":"PAYMENT_REQUIRED"}',
			],
			'invalid_json_body' => [
				'response_code'    => 500,
				'response_message' => 'Internal Server Error',
				'error_code'       => '',
				'missing_licenses' => [],
				'response_body'    => '{{invalid json}}',
			],
			'map_not_enough_content' => [
				'response_code'    => 400,
				'response_message' => 'Error: must NOT have fewer than 1 characters',
				'error_code'       => 'NOT_ENOUGH_CONTENT',
				'missing_licenses' => [],
				'response_body'    => '{"message":"Error: must NOT have fewer than 1 characters"}',
			],
			'map_client_timeout' => [
				'response_code'    => 408,
				'response_message' => 'Client timeout',
				'error_code'       => 'CLIENT_TIMEOUT',
				'missing_licenses' => [],
				'response_body'    => '{"message":"Client timeout"}',
			],
			'map_server_timeout' => [
				'response_code'    => 504,
				'response_message' => 'Server timeout',
				'error_code'       => 'SERVER_TIMEOUT',
				'missing_licenses' => [],
				'response_body'    => '{"message":"Server timeout"}',
			],
		];
	}
}
