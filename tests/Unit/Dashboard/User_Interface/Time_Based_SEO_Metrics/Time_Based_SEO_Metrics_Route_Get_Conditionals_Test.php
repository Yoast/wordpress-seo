<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Time_Based_SEO_Metrics;

use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route;

/**
 * Test class for the get_conditionals method.
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Time_Based_SEO_Metrics_Route_Get_Conditionals_Test extends Abstract_Time_Based_SEO_Metrics_Route_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Google_Site_Kit_Feature_Conditional::class ], Time_Based_SEO_Metrics_Route::get_conditionals() );
	}
}
