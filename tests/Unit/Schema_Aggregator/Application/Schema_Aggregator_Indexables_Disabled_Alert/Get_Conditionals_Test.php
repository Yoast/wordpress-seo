<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;

/**
 * Tests the get_conditionals method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Conditionals_Test extends Abstract_Schema_Aggregator_Indexables_Disabled_Alert_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Admin_Conditional::class ],
			Schema_Aggregator_Indexables_Disabled_Alert::get_conditionals()
		);
	}
}
