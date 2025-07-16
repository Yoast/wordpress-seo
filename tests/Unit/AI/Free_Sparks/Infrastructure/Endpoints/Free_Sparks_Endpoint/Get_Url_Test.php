<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;

use Brain\Monkey;

/**
 * Tests the Free_Sparks_Endpoint get_url method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_url
 */
final class Get_Url_Test extends Abstract_Free_Sparks_Endpoint_Test {

	/**
	 * Tests the get_url method.
	 *
	 * @return void
	 */
	public function test_get_url() {
		$url = 'yoast/v1/ai/free_sparks';

		Monkey\Functions\expect( 'rest_url' )
			->once()
			->with( $url )
			->andReturn( $url );

		$this->assertSame( $url, $this->instance->get_url() );
	}
}
