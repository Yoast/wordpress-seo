<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Configuration_Dismissal_Route;

/**
 * Test class for the get_conditionals method.
 *
 * @group site_kit_configuration_permanent_dismissal_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Configuration_Permanent_Dismissal_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Configuration_Permanent_Dismissal_Route_Get_Conditionals_Test extends Abstract_Site_Kit_Configuration_Permanent_Dismissal_Route_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Site_Kit_Configuration_Dismissal_Route::get_conditionals() );
	}
}
