<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Token_Request_Failed_Exception class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception
 */
final class Token_Request_Failed_Exception_Test extends TestCase {

	/**
	 * Tests the exception constructor and getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_constructor_and_getter() {
		$exception = new Token_Request_Failed_Exception( 'invalid_grant', 'Token expired', 400 );

		$this->assertSame( 'invalid_grant', $exception->get_error_code() );
		$this->assertSame( 'invalid_grant: Token expired', $exception->getMessage() );
		$this->assertSame( 400, $exception->getCode() );
	}

	/**
	 * Tests creating from a response body.
	 *
	 * @covers ::from_response
	 *
	 * @return void
	 */
	public function test_from_response() {
		$exception = Token_Request_Failed_Exception::from_response(
			[
				'error'             => 'invalid_client',
				'error_description' => 'Client not found',
			],
			401,
		);

		$this->assertSame( 'invalid_client', $exception->get_error_code() );
		$this->assertSame( 401, $exception->getCode() );
		$this->assertStringContainsString( 'Client not found', $exception->getMessage() );
	}

	/**
	 * Tests that from_response handles missing fields gracefully.
	 *
	 * @covers ::from_response
	 *
	 * @return void
	 */
	public function test_from_response_with_missing_fields() {
		$exception = Token_Request_Failed_Exception::from_response( [] );

		$this->assertSame( 'unknown_error', $exception->get_error_code() );
	}
}
