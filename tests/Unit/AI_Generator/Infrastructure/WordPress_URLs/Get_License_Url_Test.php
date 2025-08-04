<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Infrastructure\WordPress_URLs;

use Brain\Monkey;
use Mockery;
use WPSEO_Utils;
use Yoast\WP\SEO\Helpers\Url_Helper;

/**
 * Tests the WordPress_URLs' get_license_url method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs::get_license_url
 */
final class Get_License_Url extends Abstract_WordPress_URLs_Test {

	/**
	 * Tests the get_license_url method.
	 *
	 * @return void
	 */
	public function test_get_license_url() {
		$url = 'https://example.com';

		$url_helper = Mockery::mock( Url_Helper::class );
		$url_helper->expects( 'network_safe_home_url' )
			->once()
			->andReturn( $url );

		$container = $this->create_container_with(
			[
				Url_Helper::class => $url_helper,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$this->assertSame( $url, $this->instance->get_license_url() );
	}
}
