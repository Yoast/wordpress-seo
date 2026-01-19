<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Default_SEO_Data;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Test class getting the conditionals.
 *
 * @group Default_SEO_Data_Alert
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Get_Conditionals_Test extends Abstract_Default_SEO_Data_Alert_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected = [ Admin_Conditional::class ];

		$this->assertEquals( $expected, $this->instance->get_conditionals() );
	}
}
