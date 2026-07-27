<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration maybe_render_schema_map method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::maybe_render_schema_map
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::send_headers
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Maybe_Render_Schema_Map_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Tests that nothing is rendered when the request is not for the schema map.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_does_nothing_for_other_requests() {
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'yoast_schemamap' )
			->andReturn( '' );

		$this->schema_map_xml_provider->expects( 'get_xml' )->never();

		$this->expectOutputString( '' );

		$this->instance->maybe_render_schema_map();
	}

	/**
	 * Tests that the schema map XML is echoed for a schema map request.
	 *
	 * @return void
	 */
	public function test_maybe_render_schema_map_outputs_the_xml() {
		$xml = '<?xml version="1.0" encoding="UTF-8"?><urlset><url></url></urlset>';

		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'yoast_schemamap' )
			->andReturn( '1' );

		$this->schema_map_xml_provider->expects( 'get_xml' )->once()->andReturn( $xml );

		// The headers and the exit cannot run under test, so both are stubbed out.
		$instance = Mockery::mock( Schemamap_Xml_Rewrite_Integration::class, [ $this->schema_map_xml_provider ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
		$instance->expects( 'send_headers' )->once();
		$instance->expects( 'finish_request' )->once();

		$this->expectOutputString( $xml );

		$instance->maybe_render_schema_map();
	}
}
