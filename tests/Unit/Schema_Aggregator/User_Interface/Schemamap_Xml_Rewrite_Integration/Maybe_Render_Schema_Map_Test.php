<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Mockery;
use WP_Query;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration maybe_render_schema_map method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::maybe_render_schema_map
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Maybe_Render_Schema_Map_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Builds a query mock.
	 *
	 * @param bool   $is_main_query Whether the query is the main query.
	 * @param string $query_var     The value of the schema map query variable.
	 *
	 * @return Mockery\MockInterface|WP_Query The query mock.
	 */
	private function mock_query( $is_main_query, $query_var ) {
		$query = Mockery::mock( WP_Query::class );
		$query->allows( 'is_main_query' )->andReturn( $is_main_query );
		$query->allows( 'get' )->with( 'yoast_schemamap' )->andReturn( $query_var );

		return $query;
	}

	/**
	 * Builds a partial mock with the methods that cannot run under test stubbed out.
	 *
	 * @param bool $headers_sent What the headers_already_sent check should report.
	 *
	 * @return Mockery\MockInterface|Schemamap_Xml_Rewrite_Integration The partial mock.
	 */
	private function mock_instance( $headers_sent ) {
		$instance = Mockery::mock(
			Schemamap_Xml_Rewrite_Integration::class,
			[ $this->schema_map_xml_provider, $this->redirect_helper ],
		)->makePartial()->shouldAllowMockingProtectedMethods();

		$instance->allows( 'headers_already_sent' )->andReturn( $headers_sent );

		return $instance;
	}

	/**
	 * Tests that nothing is rendered for a secondary query.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_ignores_secondary_queries() {
		$this->schema_map_xml_provider->expects( 'get_xml' )->never();

		$this->expectOutputString( '' );

		$this->instance->maybe_render_schema_map( $this->mock_query( false, '1' ) );
	}

	/**
	 * Tests that nothing is rendered when the request is not for the schema map.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_does_nothing_for_other_requests() {
		$this->schema_map_xml_provider->expects( 'get_xml' )->never();

		$this->expectOutputString( '' );

		$this->instance->maybe_render_schema_map( $this->mock_query( true, '' ) );
	}

	/**
	 * Tests that nothing is rendered when the response can no longer be typed as XML.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_bails_when_headers_are_sent() {
		$instance = $this->mock_instance( true );
		$instance->expects( 'send_headers' )->never();
		$instance->expects( 'finish_request' )->never();

		$this->schema_map_xml_provider->expects( 'get_xml' )->never();

		$this->expectOutputString( '' );

		$instance->maybe_render_schema_map( $this->mock_query( true, '1' ) );
	}

	/**
	 * Tests that the schema map XML is echoed for a schema map request.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_outputs_the_xml() {
		$xml = '<?xml version="1.0" encoding="UTF-8"?><urlset><url></url></urlset>';

		$this->schema_map_xml_provider->expects( 'get_xml' )->once()->andReturn( $xml );

		$instance = $this->mock_instance( false );
		$instance->expects( 'send_headers' )->once();
		$instance->expects( 'finish_request' )->once();

		$this->expectOutputString( $xml );

		$instance->maybe_render_schema_map( $this->mock_query( true, '1' ) );
	}

	/**
	 * Tests that the XML is built before any header is committed.
	 *
	 * A build failure after the 200 and the cache headers went out would let a proxy store an error
	 * page at this path for the full max-age, so the ordering is part of the contract.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_builds_the_xml_before_sending_headers() {
		$calls = [];

		$this->schema_map_xml_provider->expects( 'get_xml' )
			->once()
			->andReturnUsing(
				static function () use ( &$calls ) {
					$calls[] = 'get_xml';

					return '<?xml version="1.0"?><urlset></urlset>';
				},
			);

		$instance = $this->mock_instance( false );
		$instance->expects( 'send_headers' )
			->once()
			->andReturnUsing(
				static function () use ( &$calls ) {
					$calls[] = 'send_headers';
				},
			);
		$instance->expects( 'finish_request' )->once();

		$this->expectOutputString( '<?xml version="1.0"?><urlset></urlset>' );

		$instance->maybe_render_schema_map( $this->mock_query( true, '1' ) );

		$this->assertSame( [ 'get_xml', 'send_headers' ], $calls );
	}
}
