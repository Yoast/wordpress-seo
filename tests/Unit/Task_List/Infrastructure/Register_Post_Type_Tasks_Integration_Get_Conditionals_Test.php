<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure;

use Yoast\WP\SEO\Conditionals\Task_List_Enabled_Conditional;

/**
 * Test class for get_conditionals.
 *
 * @group Register_Post_Type_Tasks_Integration
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Post_Type_Tasks_Integration_Get_Conditionals_Test extends Abstract_Register_Post_Type_Tasks_Integration_Test {

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
