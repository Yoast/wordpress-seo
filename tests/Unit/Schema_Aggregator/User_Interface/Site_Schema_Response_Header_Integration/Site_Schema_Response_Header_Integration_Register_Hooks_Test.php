<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;

use Brain\Monkey;

/**
 * Test class for the register_hooks method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Schema_Response_Header_Integration_Register_Hooks_Test extends Abstract_Site_Schema_Response_Header_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Filters\has( 'rest_pre_serve_request', [ $this->instance, 'serve_custom_response' ] ),
		);
	}
}
