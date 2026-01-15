<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint;

/**
 * Test class for get_name.
 *
 * @group Manually_Complete_Task_Endpoint
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint::get_name
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manually_Complete_Task_Endpoint_Get_Name_Test extends Abstract_Manually_Complete_Task_Endpoint_Test {

	/**
	 * Tests the get_name method.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$result = $this->instance->get_name();

		$this->assertSame( 'setTaskCompletion', $result );
	}
}
