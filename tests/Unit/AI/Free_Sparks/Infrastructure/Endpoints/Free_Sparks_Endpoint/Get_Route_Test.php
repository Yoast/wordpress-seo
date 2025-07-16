<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Unit\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;

/**
 * Tests the Free_Sparks_Endpoint get_route method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_route
 */
final class Get_Route_Test extends Abstract_Free_Sparks_Endpoint_Test {

	/**
	 * Tests the get_route method.
	 *
	 * @return void
	 */
	public function test_get_route() {
		$this->assertSame( '/ai/free_sparks', $this->instance->get_route() );
	}
}
