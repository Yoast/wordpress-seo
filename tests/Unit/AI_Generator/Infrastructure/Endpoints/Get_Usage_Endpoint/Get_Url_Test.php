<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint;

use Brain\Monkey;

/**
 * Tests the Get_Usage_Endpoint's get_url method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_url
 */
final class Get_Url_Test extends Abstract_Get_Usage_Endpoint_Test {

	/**
	 * Tests the get_url method.
	 *
	 * @return void
	 */
	public function test_get_url() {
		$url = 'yoast/v1/ai_generator/get_usage';

		Monkey\Functions\expect( 'rest_url' )
			->once()
			->with( $url )
			->andReturn( $url );

		$this->assertSame( $url, $this->instance->get_url() );
	}
}
