<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Debug_Display;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Test class getting the conditionals.
 *
 * @group Debug_Display
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Debug_Display_Alert_Get_Conditionals_Test extends Abstract_Debug_Display_Alert_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected = [ Admin_Conditional::class ];

		$this->assertEquals( $expected, $this->instance::get_conditionals() );
	}
}
