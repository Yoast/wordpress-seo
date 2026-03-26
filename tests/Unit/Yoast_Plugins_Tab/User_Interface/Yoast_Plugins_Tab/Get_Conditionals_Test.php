<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\User_Interface\Yoast_Plugins_Tab;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Tests the Yoast_Plugins_Tab_Integration get_conditionals method.
 *
 * @group yoast-plugins-tab
 *
 * @covers Yoast\WP\SEO\Yoast_Plugins_Tab\User_Interface\Yoast_Plugins_Tab_Integration::get_conditionals
 */
final class Get_Conditionals_Test extends Abstract_Yoast_Plugins_Tab_Integration_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected = [
			Admin_Conditional::class,
		];

		$this->assertSame( $expected, $this->instance->get_conditionals() );
	}
}
