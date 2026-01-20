<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\User_Interface;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Site_Schema_Aggregator_Xml_Route_Test.
 *
 * @group  schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route::render_schema_xml
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route::__construct
 */
final class Site_Schema_Aggregator_Xml_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Schema_Aggregator_Xml_Route
	 */
	private $instance;

	/**
	 * Holds the aggregate site schema map command handler mock.
	 *
	 * @var Aggregate_Site_Schema_Map_Command_Handler
	 */
	private $aggregate_site_schema_map_command_handler;

	/**
	 * Holds the XML cache manager mock.
	 *
	 * @var Xml_Manager
	 */
	private $xml_cache_manager;

	/**
	 * Holds the aggregator config mock.
	 *
	 * @var Aggregator_Config
	 */
	private $aggregator_config;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		$this->aggregate_site_schema_map_command_handler = Mockery::mock( Aggregate_Site_Schema_Map_Command_Handler::class );
		$this->xml_cache_manager                         = Mockery::mock( Xml_Manager::class );
		$this->aggregator_config                         = Mockery::mock( Aggregator_Config::class );
		$this->instance                                  = new Site_Schema_Aggregator_Xml_Route( $this->aggregate_site_schema_map_command_handler, $this->xml_cache_manager, $this->aggregator_config );
	}

	/**
	 * Tests the xml map without cache.
	 *
	 * @return void
	 */
	public function test_render_schema_xml_no_cache() {
		\YoastSEO()->helpers->options->set( 'enable_schema_aggregation_endpoint', true );
		$this->xml_cache_manager->expects( 'get' )
			->once()
			->andReturn( false );
		$this->aggregator_config->expects( 'get_allowed_post_types' )
			->once()
			->andReturn( [ 'page' ] );
		$this->xml_cache_manager->expects( 'set' )
			->once();

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
	 * Tests the xml map with cache.
	 *
	 * @return void
	 */
	public function test_render_schema_xml_with_cache() {
		\YoastSEO()->helpers->options->set( 'enable_schema_aggregation_endpoint', true );
		$this->xml_cache_manager->expects( 'get' )
			->once()
			->andReturn( '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>' );
		$this->aggregator_config->expects( 'get_allowed_post_types' )
			->once()
			->andReturn( [ 'page' ] );
		$this->xml_cache_manager->expects( 'set' )
			->never();

		$request  = new WP_REST_Request( 'GET', '/yoast/v1/schema-aggregator/get-xml' );
		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 200, $response->status );
		$this->assertStringContainsString( '<urlset', $response_data );
		$this->assertSame( 'application/xml; charset=UTF-8', $response->get_headers()['Content-Type'] );
		$this->assertSame( 'public, max-age=300', $response->get_headers()['Cache-Control'] );
	}
}
