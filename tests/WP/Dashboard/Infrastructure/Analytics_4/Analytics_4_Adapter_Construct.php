<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Api_Call;

/**
 * Test class for the __construct() method.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Construct extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests __construct().
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Site_Kit_Analytics_4_Api_Call::class,
			$this->getPropertyValue( $this->instance, 'site_kit_search_console_api_call' )
		);
	}
}
