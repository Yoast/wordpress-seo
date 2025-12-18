<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\Infrastructure\Tracking_On_Page_Load;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Tests the Tracking_On_Page_Load_Integration get_conditionals method.
 *
 * @group tracking
 *
 * @covers Yoast\WP\SEO\Tracking\Infrastructure\Tracking_On_Page_Load_Integration::get_conditionals
 */
final class Get_Conditionals_Test extends Abstract_Tracking_On_Page_Load_Integration_Test {

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
