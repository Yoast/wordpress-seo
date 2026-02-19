<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Header_Adapter;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;

/**
 * Test class for the constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Schema_Response_Header_Integration_Construct_Test extends Abstract_Site_Schema_Response_Header_Integration_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf( Site_Schema_Response_Header_Integration::class, $this->instance );
		$this->assertInstanceOf(
			Schema_Map_Header_Adapter::class,
			$this->getPropertyValue( $this->instance, 'schema_map_header_adapter' ),
		);
	}
}
