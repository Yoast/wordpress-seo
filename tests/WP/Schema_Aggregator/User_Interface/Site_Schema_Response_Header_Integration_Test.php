<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Header_Adapter;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Site_Schema_Response_Header_Integration.
 *
 * @group  schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration::serve_custom_response
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration::__construct
 */
final class Site_Schema_Response_Header_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Schema_Response_Header_Integration
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$schema_map_header_adapter = new Schema_Map_Header_Adapter();
		$this->instance            = new Site_Schema_Response_Header_Integration( $schema_map_header_adapter );
	}

	/**
	 * Tests that serve_custom_response returns false for non-schema-aggregator routes.
	 *
	 * @return void
	 */
	public function test_serve_custom_response_returns_false_for_non_schema_aggregator_route() {
		$request  = new WP_REST_Request( 'GET', '/wp/v2/posts' );
		$response = new WP_REST_Response( [ 'test' => 'data' ] );

		$result = $this->instance->serve_custom_response( false, $response, $request );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that serve_custom_response returns false for error responses.
	 *
	 * @return void
	 */
	public function test_serve_custom_response_returns_false_for_error_response() {
		$request  = new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-xml' );
		$response = new WP_REST_Response( [ 'error' => 'Something went wrong' ], 500 );

		$result = $this->instance->serve_custom_response( false, $response, $request );

		$this->assertFalse( $result );
	}

	/**
	 * Tests if the headers are correctly set for an XML response.
	 *
	 * This test uses runInSeparateProcess to allow header() calls to work.
	 *
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 *
	 * @return void
	 */
	public function test_serve_custom_response_sends_xml_headers() {
		$schema_map_header_adapter = new Schema_Map_Header_Adapter();
		$instance                  = new Site_Schema_Response_Header_Integration( $schema_map_header_adapter );

		$request  = new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-xml' );
		$response = new WP_REST_Response( '<urlset><url><loc>https://example.com/</loc></url></urlset>' );
		$response->set_headers(
			[
				'Content-Type' => 'application/xml; charset=UTF-8',
			]
		);

		\ob_start();
		$result = $instance->serve_custom_response( false, $response, $request );
		 \ob_get_clean();

		$this->assertTrue( $result );
		$headers = $this->get_sent_headers();
		$this->assertContainsHeader( 'Content-Type: application/xml; charset=UTF-8', $headers );
	}

	/**
	 * Tests if the headers are correctly set for a JSON response.
	 *
	 * This test uses runInSeparateProcess to allow header() calls to work.
	 *
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 *
	 * @return void
	 */
	public function test_serve_custom_response_sends_json_headers() {
		$schema_map_header_adapter = new Schema_Map_Header_Adapter();
		$instance                  = new Site_Schema_Response_Header_Integration( $schema_map_header_adapter );

		$request  = new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-schema' );
		$response = new WP_REST_Response(
			[
				[
					'@type' => 'WebPage',
					'name'  => 'Test Page',
				],
			]
		);
		$response->set_headers(
			[
				'Content-Type' => 'application/json; charset=UTF-8',
			]
		);

		// Start multiple output buffers because the adapter calls ob_flush() internally. Otherwise the output gets spammed with random content.
		\ob_start();
		\ob_start();
		$result = $instance->serve_custom_response( false, $response, $request );
		// Clean up the buffers - output may have been flushed already due to flush() call.
		\ob_end_clean();
		\ob_end_clean();

		$this->assertTrue( $result );

		$headers = $this->get_sent_headers();
		$this->assertContainsHeader( 'Content-Type: application/json; charset=UTF-8', $headers );
		$this->assertContainsHeader( 'X-Accel-Buffering: no', $headers );
	}

	/**
	 * Gets the headers that were sent.
	 *
	 * @return array<string> List of headers.
	 */
	private function get_sent_headers(): array {
		return \xdebug_get_headers();
	}

	/**
	 * Asserts that a header is present in the list of headers.
	 *
	 * @param string        $expected_header The expected header string.
	 * @param array<string> $headers         The list of headers.
	 *
	 * @return void
	 */
	private function assertContainsHeader( string $expected_header, array $headers ): void {
		$found = false;
		foreach ( $headers as $header ) {
			if ( \stripos( $header, $expected_header ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, \sprintf( 'Expected header "%s" not found in headers: %s', $expected_header, \implode( ', ', $headers ) ) );
	}
}
