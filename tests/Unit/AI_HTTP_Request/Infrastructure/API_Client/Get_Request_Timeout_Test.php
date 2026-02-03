<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;

/**
 * Class Get_Request_Timeout_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client::get_request_timeout
 */
final class Get_Request_Timeout_Test extends Abstract_API_Client_Test {

	/**
	 * Tests the get_request_timeout method.
	 *
	 * @return void
	 */
	public function test_get_request_timeout() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_suggestions_timeout', 60 )
			->andReturn( 60 );

		$result = $this->instance->get_request_timeout();

		$this->assertEquals( 60, $result );
	}
}
