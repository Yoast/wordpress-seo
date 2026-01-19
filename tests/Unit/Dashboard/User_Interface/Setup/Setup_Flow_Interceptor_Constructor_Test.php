<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;

/**
 * Test intercept_site_kit_setup_flow method.
 *
 * @group site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\SetUp\Setup_Flow_Interceptor::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Flow_Interceptor_Constructor_Test extends Abstract_Setup_Flow_Interceptor_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
		$this->assertInstanceOf(
			Redirect_Helper::class,
			$this->getPropertyValue( $this->instance, 'redirect_helper' )
		);
	}
}
