<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use WPSEO_Admin_Asset;
use WPSEO_Admin_Asset_Dev_Server_Location;
use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Tests WPSEO_Admin_Asset_Dev_Server_Location.
 */
final class Asset_Dev_Server_Location_Test extends TestCase {

	/**
	 * Default arguments to use for creating a new Admin_Asset.
	 *
	 * @var array
	 */
	private $asset_defaults = [
		'name' => 'commons',
		'src'  => 'commons',
	];

	/**
	 * Basic get_url test.
	 *
	 * @covers WPSEO_Admin_Asset_Dev_Server_Location::get_url
	 *
	 * @return void
	 */
	public function test_get_url() {
		$asset = new WPSEO_Admin_Asset( $this->asset_defaults );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'http://localhost:8080/js/dist/commons.js', $actual );
	}

	/**
	 * Tests that the constructor accepts a different dev server URL.
	 *
	 * @covers WPSEO_Admin_Asset_Dev_Server_Location::get_url
	 *
	 * @return void
	 */
	public function test_get_url_different_url() {
		$asset = new WPSEO_Admin_Asset( $this->asset_defaults );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location( 'https://localhost:8081' );

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'https://localhost:8081/js/dist/commons.js', $actual );
	}
}
