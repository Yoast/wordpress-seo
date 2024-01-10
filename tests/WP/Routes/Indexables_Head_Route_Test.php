<?php

namespace Yoast\WP\SEO\Tests\WP\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Indexable_Head_Route class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Routes\Indexables_Head_Route
 */
final class Indexables_Head_Route_Test extends TestCase {

	/**
	 * Tests the register_routes method.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_has_route() {
			$routes = \rest_get_server()->get_routes();
			$this->assertArrayHasKey( '/yoast/v1/get_head', $routes );
	}

	/**
	 * Tests the get_head method.
	 *
	 * @covers ::get_head
	 * @covers ::is_valid_url
	 *
	 * @dataProvider data_provider_get_head
	 *
	 * @param string $url    The url.
	 * @param int    $status The expected status.
	 *
	 * @return void
	 */
	public function test_get_head( $url, $status ) {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/get_head' );
		$request->set_param( 'url', $url );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$response,
			'get_head WP_REST_Response object'
		);

		$this->assertEquals(
			$status,
			$response->status,
			'get_head response status'
		);
	}

	/**
	 * Data provider for test_get_head.
	 *
	 * @return array<string,int>
	 */
	public function data_provider_get_head() {
		yield 'Home URL' => [
			'url'    => \trailingslashit( \home_url() ),
			'status' => 200,
		];
		yield 'Multiple words search string' => [
			'url'    => \add_query_arg( 's', 'xxx yyy', \trailingslashit( \home_url() ) ),
			'status' => 200,
		];
		yield 'Invalid URL' => [
			'url'    => 'This is not a URL',
			'status' => 400,
		];
	}
}
