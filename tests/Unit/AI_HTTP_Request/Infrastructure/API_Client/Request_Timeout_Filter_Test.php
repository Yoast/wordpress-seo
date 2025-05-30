<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;

/**
 * Class Get_Request_Timeout_Filter_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client::get_request_timeout
 */
final class Request_Timeout_Filter_Test extends Abstract_API_Client_Test {

	/**
	 * Tests the get_request_timeout method with a custom timeout.
	 *
	 * @return void
	 */
	public function test_get_request_timeout_filter() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_suggestions_timeout', 60 )
			->andReturn( 120 );

		$result = $this->instance->get_request_timeout();

		$this->assertEquals( 120, $result );
	}
}
