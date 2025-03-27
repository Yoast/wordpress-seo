<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route;

/**
 * Test class for the get_conditionals method.
 *
 * @group setup_steps_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Setup_Steps_Tracking_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_Route_Get_Conditionals_Test extends Abstract_Setup_Steps_Tracking_Route_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Setup_Steps_Tracking_Route::get_conditionals() );
	}
}
