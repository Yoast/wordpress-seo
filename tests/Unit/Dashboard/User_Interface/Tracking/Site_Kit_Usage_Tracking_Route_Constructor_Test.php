<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Site_Kit_Usage_Tracking_Repository_Interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Site_Kit_Usage_Tracking_Route;

/**
 * Test class for the constructor.
 *
 * @group site_kit_usage_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Site_Kit_Usage_Tracking_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Usage_Tracking_Route_Constructor_Test extends Abstract_Site_Kit_Usage_Tracking_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Site_Kit_Usage_Tracking_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'site_kit_usage_tracking_repository' )
		);
	}
}
