<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Config;

/**
 * Test class for the get_max_per_page method.
 *
 * @group schema-aggregator
 * @group Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config::get_max_per_page
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Config_Get_Max_Per_Page_Test extends Abstract_Config_Test {

	/**
	 * Tests getting the maximum per page count.
	 *
	 * @return void
	 */
	public function test_get_max_per_page() {
		$this->assertEquals( 1000, $this->instance->get_max_per_page() );
	}
}
