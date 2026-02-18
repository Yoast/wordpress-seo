<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Indexables_Disabled;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Test class getting the conditionals.
 *
 * @group Indexables_Disabled
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Indexables_Disabled\Indexables_Disabled_Alert::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Indexables_Disabled_Alert_Get_Conditionals_Test extends Abstract_Indexables_Disabled_Alert_Test {

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
