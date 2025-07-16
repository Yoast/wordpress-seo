<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;

/**
 * Tests the Free_Sparks_Endpoint get_namespace method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_namespace
 */
final class Get_Namespace_Test extends Abstract_Free_Sparks_Endpoint_Test {

	/**
	 * Tests the get_namespace method.
	 *
	 * @return void
	 */
	public function test_get_namespace() {
		$this->assertSame( 'yoast/v1', $this->instance->get_namespace() );
	}
}
