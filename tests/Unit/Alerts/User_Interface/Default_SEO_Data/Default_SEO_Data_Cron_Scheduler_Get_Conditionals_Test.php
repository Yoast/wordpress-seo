<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data;

/**
 * Test class for the get_conditionals method.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_Seo_Data\Default_SEO_Data_Cron_Scheduler::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Cron_Scheduler_Get_Conditionals_Test extends Abstract_Default_SEO_Data_Cron_Scheduler_Test {

	/**
	 * Tests if the conditionals are retrieved properly.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		// The Default_SEO_Data_Cron_Scheduler uses the No_Conditionals trait, so it should return an empty array.
		$this->assertSame( [], $this->instance::get_conditionals() );
	}
}
