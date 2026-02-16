<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_XML_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Site_Schema_Aggregator_Xml_Route's register_routes method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Site_Schema_Aggregator_Xml_Route_Test {

	/**
	 * Tests that register_routes registers the expected route.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'schema-aggregator/get-xml',
				[
					'methods'             => 'GET',
					'callback'            => [ $this->instance, 'render_schema_xml' ],
					'permission_callback' => [ $this->instance, 'get_permission_callback' ],
				],
			);

		$this->instance->register_routes();
	}
}
