<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

use Brain\Monkey\Functions;

/**
 * Test Setup_Url_Interceptor method.
 *
 * @group  site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor::add_redirect_page
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Url_Interceptor_Add_Redirect_Page_Test extends Abstract_Setup_Url_Interceptor_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_add_redirect_page() {
		Functions\expect( 'add_submenu_page' )
			->once()
			->with(
				'',
				'',
				'',
				'wpseo_manage_options',
				'wpseo_page_site_kit_set_up'
			);

		$this->assertEquals( [], $this->instance->add_redirect_page( [] ) );
	}
}
