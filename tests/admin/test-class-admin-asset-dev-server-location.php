<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Tests WPSEO_Admin_Asset_Dev_Server_Location
 */
final class Test_Admin_Asset_Dev_Server_Location extends PHPUnit_Framework_TestCase {

	/**
	 * Basic get_url test.
	 *
	 * @covers WPSEO_Admin_Asset_Dev_Server_Location::get_url()
	 */
	public function test_get_url() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'commons',
			'src'  => 'commons',
		) );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'http://localhost:8080/commons' . WPSEO_CSSJS_SUFFIX . '.js', $actual );
	}

	/**
	 * Tests that the constructor accepts a different dev server URL.
	 *
	 * @covers WPSEO_Admin_Asset_Dev_Server_Location::get_url()
	 */
	public function test_get_url_different_url() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'commons',
			'src'  => 'commons',
		) );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location( 'https://localhost:8081' );

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'https://localhost:8081/commons' . WPSEO_CSSJS_SUFFIX . '.js', $actual );
	}

	/**
	 * Tests that the dev server falls back to the default asset if it isn't on the dev server.
	 *
	 * @integration_test
	 *
	 * @covers WPSEO_Admin_Asset_Dev_Server_Location::get_url()
	 * @covers WPSEO_Admin_Asset_SEO_Location::get_url()
	 */
	public function test_get_url_default() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'commons',
			'src'  => 'select2',
		) );

		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();
		$default_location    = new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );

		$actual   = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );
		$expected = $default_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );

		$this->assertEquals( $expected, $actual );
	}
}
