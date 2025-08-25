<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Infrastructure\WordPress_URLs;

use Brain\Monkey\Functions;

/**
 * Tests the WordPress_URLs' get_refresh_callback_url method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs::get_refresh_callback_url
 */
final class Get_Refresh_Callback_Url_Test extends Abstract_WordPress_URLs_Test {

	/**
	 * Tests the get_refresh_callback_url method.
	 *
	 * @return void
	 */
	public function test_get_refresh_callback_url() {
		$url = 'yoast/v1/ai_generator/refresh_callback';

		Functions\expect( 'get_rest_url' )
			->once()
			->with( null, $url )
			->andReturn( $url );

		$this->assertSame( $url, $this->instance->get_refresh_callback_url() );
	}
}
