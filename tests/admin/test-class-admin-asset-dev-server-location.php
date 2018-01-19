<?php

class Test_Admin_Asset_Dev_Server_Location extends PHPUnit_Framework_TestCase {

	public function test_get_url() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'commons',
			'src'  => 'commons',
		) );
		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'http://localhost:8080/commons' . WPSEO_CSSJS_SUFFIX . '.js', $actual );
	}

	public function test_get_url_different_url() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'commons',
			'src'  => 'commons',
		) );
		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location( 'https://localhost:8081' );

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( 'https://localhost:8081/commons' . WPSEO_CSSJS_SUFFIX . '.js', $actual );
	}

	public function test_get_url_default() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'commons',
			'src'  => 'commons',
		) );
		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();
		$default_location = new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );
		$expected = $default_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );

		$this->assertEquals( $expected, $actual );
	}

	public function test_get_url_default_2() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'other',
			'src'  => 'other',
		) );
		$dev_server_location = new WPSEO_Admin_Asset_Dev_Server_Location();
		$default_location = new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );

		$actual = $dev_server_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );
		$expected = $default_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );

		$this->assertEquals( $expected, $actual );
	}
}
