<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Infrastructure\Endpoints\Get_Usage_Endpoint;

/**
 * Tests the Get_Usage_Endpoint's get_route method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_route
 */
final class Get_Route_Test extends Abstract_Get_Usage_Endpoint_Test {

	/**
	 * Tests the get_route method.
	 *
	 * @return void
	 */
	public function test_get_route() {
		$this->assertSame( '/ai_generator/get_usage', $this->instance->get_route() );
	}
}
