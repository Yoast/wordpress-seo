<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint;

/**
 * Test class for get_namespace.
 *
 * @group Manually_Complete_Task_Endpoint
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint::get_namespace
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manually_Complete_Task_Endpoint_Get_Namespace_Test extends Abstract_Manually_Complete_Task_Endpoint_Test {

	/**
	 * Tests the get_namespace method.
	 *
	 * @return void
	 */
	public function test_get_namespace() {
		$result = $this->instance->get_namespace();

		$this->assertSame( 'yoast/v1', $result );
	}
}
