<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Brain\Monkey;

/**
 * Test class for the get_conditionals method.
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Capabilities_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Capabilities_Integration_Register_Hooks_Test extends Abstract_Site_Kit_Capabilities_Integration_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Functions\expect( 'add_filter' )
			->once()
			->with( 'user_has_cap', [ $this->instance, 'enable_site_kit_capabilities' ], 10, 2 );

		$this->instance->register_hooks();
	}
}
