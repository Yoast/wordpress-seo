<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;

/**
 * Tests the Free_Sparks_Endpoint constructor.
 *
 * @group  ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_name
 */
final class Get_Name_Test extends Abstract_Free_Sparks_Endpoint_Test {

	/**
	 * Tests the get_name method.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'free_sparks', $this->instance->get_name() );
	}
}
