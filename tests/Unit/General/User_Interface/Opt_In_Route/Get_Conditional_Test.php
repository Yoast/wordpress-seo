<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\General\User_Interface\Opt_In_Route;

use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;

/**
 * Tests the Opt_In_Route get_conditionals method.
 *
 * @group opt-in-route
 *
 * @covers \Yoast\WP\SEO\General\User_Interface\Opt_In_Route::get_conditionals
 */
final class Get_Conditional_Test extends Abstract_Opt_In_Route_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Yoast_Admin_And_Dashboard_Conditional::class ],
			$this->instance::get_conditionals()
		);
	}
}
