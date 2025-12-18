<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration;

/**
 * Test class for the get_conditionals method.
 *
 * @group Site_Schema_Robots_Txt_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Schema_Robots_Txt_Integration_Get_Conditionals_Test extends Abstract_Site_Schema_Robots_Txt_Integration_Test {

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Schema_Aggregator_Conditional::class ],
			Site_Schema_Robots_Txt_Integration::get_conditionals()
		);
	}
}
