<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\WordPress_Current_Site_URL_Provider;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for the WordPress_Current_Site_URL_Provider.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\WordPress_Current_Site_URL_Provider::get_current_site_url
 *
 * @group schema-aggregator
 */
final class WordPress_Current_Site_URL_Provider_Test extends TestCase {

	/**
	 * Tests that get_current_site_url returns the home URL with a trailing slash.
	 *
	 * @return void
	 */
	public function test_get_current_site_url() {
		Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		Functions\expect( 'get_home_url' )
			->once()
			->with( 1 )
			->andReturn( 'https://example.com' );

		Functions\expect( 'trailingslashit' )
			->once()
			->with( 'https://example.com' )
			->andReturn( 'https://example.com/' );

		$instance = new WordPress_Current_Site_URL_Provider();
		$result   = $instance->get_current_site_url();

		$this->assertSame( 'https://example.com/', $result );
	}
}
