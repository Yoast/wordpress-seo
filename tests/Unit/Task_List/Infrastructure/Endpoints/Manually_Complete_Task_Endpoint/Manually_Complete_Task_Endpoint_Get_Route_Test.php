<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint;

/**
 * Test class for get_route.
 *
 * @group Manually_Complete_Task_Endpoint
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint::get_route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manually_Complete_Task_Endpoint_Get_Route_Test extends Abstract_Manually_Complete_Task_Endpoint_Test {

	/**
	 * Tests the get_route method.
	 *
	 * @return void
	 */
	public function test_get_route() {
		$result = $this->instance->get_route();

		$this->assertSame( '/manually_complete_task', $result );
	}
}
