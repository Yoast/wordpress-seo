<?php

namespace Yoast\WP\SEO\Tests\Admin;

use Brain\Monkey;
use WPSEO_Admin_Asset;
use WPSEO_Admin_Asset_Analysis_Worker_Location;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Tests WPSEO_Admin_Asset.
 *
 * @coversDefaultClass WPSEO_Admin_Asset_Analysis_Worker_Location
 */
final class Admin_Asset_Analysis_Worker_Location_Test extends TestCase {

	/**
	 * Tests the get_url function.
	 *
	 * @covers ::get_url
	 */
	public function test_get_url() {
		$version  = 'test-version';
		$location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $version );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( $location->get_asset()->get_src(), \PHP_URL_SCHEME )
			->andReturnNull();

		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'js/dist/analysis-worker-' . $version . '.js', \realpath( __DIR__ . '/../../wp-seo.php' ) )
			->andReturn( 'asset_location' );

		$actual = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$this->assertSame( 'asset_location', $actual );
	}

	/**
	 * Tests the get_url function when we pass a name.
	 *
	 * @covers ::get_url
	 */
	public function test_get_url_with_name() {
		$custom_file_name = 'custom-name';
		$version          = 'test-version';

		$location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $version, $custom_file_name );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( $location->get_asset()->get_src(), \PHP_URL_SCHEME )
			->andReturnNull();

		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'js/dist/' . $custom_file_name . '-' . $version . '.js', \realpath( __DIR__ . '/../../wp-seo.php' ) )
			->andReturn( 'asset_location' );

		$actual = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$this->assertSame( 'asset_location', $actual );
	}
}
