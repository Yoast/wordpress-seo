<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Complete_Task;

use Yoast\WP\SEO\Conditionals\Task_List_Enabled_Conditional;

/**
 * Test class for get_conditionals.
 *
 * @group Complete_Task_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Complete_Task_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Complete_Task_Route_Get_Conditionals_Test extends Abstract_Complete_Task_Route_Test {

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected_result = [
			Task_List_Enabled_Conditional::class,
		];

		$this->assertEquals( $expected_result, $this->instance::get_conditionals() );
	}
}
