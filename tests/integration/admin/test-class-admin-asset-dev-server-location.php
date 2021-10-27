<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Tests WPSEO_Admin_Asset_Dev_Server_Location.
 */
final class Admin_Asset_Dev_Server_Location_Test extends TestCase {

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
	 */
	public function test_get_url_different_url() {
		$asset = new WPSEO_Admin_Asset( $this->asset_defaults );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location( 'https://localhost:8081' );

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'https://localhost:8081/js/dist/commons.js', $actual );
	}

	/**
	 * Tests that the dev server falls back to the default asset if it isn't on the dev server.
	 *
	 * @covers WPSEO_Admin_Asset_Dev_Server_Location::get_url
	 * @covers WPSEO_Admin_Asset_SEO_Location::get_url
	 */
	public function test_get_url_default() {
		$asset_args        = $this->asset_defaults;
		$asset_args['src'] = 'select2';
		$asset             = new WPSEO_Admin_Asset( $asset_args );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();
		$default_location    = new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );

		$actual   = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );
		$expected = $default_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );

		$this->assertEquals( $expected, $actual );
	}
}
