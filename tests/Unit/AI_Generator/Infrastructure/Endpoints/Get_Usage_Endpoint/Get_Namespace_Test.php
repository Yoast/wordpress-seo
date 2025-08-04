<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint;

/**
 * Tests the Get_Usage_Endpoint get_namespace method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_namespace
 */
final class Get_Namespace_Test extends Abstract_Get_Usage_Endpoint_Test {

	/**
	 * Tests the get_namespace method.
	 *
	 * @return void
	 */
	public function test_get_namespace() {
		$this->assertSame( 'yoast/v1', $this->instance->get_namespace() );
	}
}
