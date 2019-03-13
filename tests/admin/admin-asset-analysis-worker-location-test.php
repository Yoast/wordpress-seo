<?php

namespace Yoast\WP\Free\Tests\Admin;

use WPSEO_Admin_Asset;
use WPSEO_Admin_Asset_Analysis_Worker_Location;
use Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Tests WPSEO_Admin_Asset.
 */
final class Admin_Asset_Analysis_Worker_Location_Test extends TestCase {
	/**
	 * Tests the get_url function.
	 *
	 * @covers WPSEO_Admin_Asset_Analysis_Worker_Location::get_url
	 */
	public function test_get_url() {
		$version          = 'test-version';

		$location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $version );
		$suffix   = ( \YOAST_ENVIRONMENT === 'development' ) ? '' : '.min';

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( $location->get_asset()->get_src(), \PHP_URL_SCHEME )
			->andReturnNull();

		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'js/dist/wp-seo-analysis-worker-' . $version . $suffix . '.js', \realpath( __DIR__ . "/../../wp-seo.php" ) )
			->andReturn( 'asset_location' );

		$actual = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$this->assertSame( 'asset_location', $actual );
	}

	/**
	 * Tests the get_url function when we pass a name.
	 *
	 * @covers WPSEO_Admin_Asset_Analysis_Worker_Location::get_url
	 */
	public function test_get_url_with_name() {
		$custom_file_name = 'custom-name';
		$version          = 'test-version';

		$location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $version, $custom_file_name );
		$suffix   = ( \YOAST_ENVIRONMENT === 'development' ) ? '' : '.min';

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( $location->get_asset()->get_src(), \PHP_URL_SCHEME )
			->andReturnNull();

		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->with( 'js/dist/wp-seo-' . $custom_file_name . '-' . $version . $suffix . '.js', \realpath( __DIR__ . "/../../wp-seo.php" ) )
			->andReturn( 'asset_location' );

		$actual = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$this->assertSame( 'asset_location', $actual );
	}
}
