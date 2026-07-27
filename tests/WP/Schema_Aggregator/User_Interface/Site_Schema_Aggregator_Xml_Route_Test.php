<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Site_Schema_Aggregator_Xml_Route_Test.
 *
 * @group  schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route::render_schema_xml
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider::get_xml
 */
final class Site_Schema_Aggregator_Xml_Route_Test extends TestCase {

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		\YoastSEO()->helpers->options->set( 'enable_schema_aggregation_endpoint', true );

		\do_action( 'rest_api_init' );
	}

	/**
	 * Tests that the route renders the schema map as XML.
	 *
	 * @return void
	 */
	public function test_render_schema_xml() {
		$request  = new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-xml' );
		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$response_data = $response->get_data();

		$this->assertSame( 200, $response->status );
		$this->assertStringContainsString( '<urlset', $response_data );
		$this->assertSame( 'application/xml; charset=UTF-8', $response->get_headers()['Content-Type'] );
		$this->assertSame( 'public, max-age=300', $response->get_headers()['Cache-Control'] );
	}

	/**
	 * Tests that a second request is served from the cache and produces the same XML.
	 *
	 * @return void
	 */
	public function test_render_schema_xml_is_cached() {
		$first  = \rest_get_server()->dispatch( new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-xml' ) );
		$second = \rest_get_server()->dispatch( new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-xml' ) );

		$this->assertSame( $first->get_data(), $second->get_data() );
	}
}
