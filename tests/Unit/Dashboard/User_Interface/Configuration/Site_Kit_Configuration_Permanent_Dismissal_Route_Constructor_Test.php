<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface;

/**
 * Test class for the constructor.
 *
 * @group site_kit_configuration_permanent_dismissal_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Configuration_Permanent_Dismissal_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Configuration_Permanent_Dismissal_Route_Constructor_Test extends Abstract_Site_Kit_Configuration_Permanent_Dismissal_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'permanently_dismissed_site_kit_configuration_repository' )
		);
	}
}
