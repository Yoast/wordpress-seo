<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Yoast\WP\SEO\Conditionals\Third_Party\Site_Kit_Conditional;
use Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Capabilities_Integration;

/**
 * Test class for the get_conditionals method.
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Capabilities_Integration::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Capabilities_Integration_Get_Conditionals_Test extends Abstract_Site_Kit_Capabilities_Integration_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Site_Kit_Conditional::class ], Site_Kit_Capabilities_Integration::get_conditionals() );
	}
}
