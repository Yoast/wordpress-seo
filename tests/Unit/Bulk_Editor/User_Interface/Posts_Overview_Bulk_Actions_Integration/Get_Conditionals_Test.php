<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Tests getting the conditionals.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration::get_conditionals
 */
final class Get_Conditionals_Test extends Abstract_Posts_Overview_Bulk_Actions_Integration_Test {

	/**
	 * Tests getting the conditionals.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [ Admin_Conditional::class ], Posts_Overview_Bulk_Actions_Integration::get_conditionals() );
	}
}
