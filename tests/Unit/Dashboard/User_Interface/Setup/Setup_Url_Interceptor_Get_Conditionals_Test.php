<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor;

/**
 * Test Setup_Url_Interceptor method.
 *
 * @group site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Url_Interceptor_Get_Conditionals_Test extends Abstract_Setup_Url_Interceptor_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Admin_Conditional::class ], Setup_Url_Interceptor::get_conditionals() );
	}
}
