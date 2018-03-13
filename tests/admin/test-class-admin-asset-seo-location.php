<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Tests WPSEO_Admin_Asset
 */
final class Test_WPSEO_Admin_Asset_SEO_Location extends PHPUnit_Framework_TestCase {

	/**
	 * Tests the get_url function.
	 *
	 * @covers WPSEO_Admin_Asset_SEO_Location::get_url()
	 */
	public function test_get_url() {
		$asset = new WPSEO_Admin_Asset( array(
			'name'      => 'name',
			'src'       => 'src',
			'deps'      => array( 'deps' ),
			'version'   => 'version',
			'media'     => 'screen',
			'in_footer' => false,
			'suffix'    => '.suffix',
			'rtl'       => false,
		) );

		$expected_js    = home_url() . '/wp-content/plugins/wordpress-seo/js/dist/src.suffix.js';
		$expected_css   = home_url() . '/wp-content/plugins/wordpress-seo/css/dist/src.suffix.css';
		$expected_empty = '';

		$location = new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );

		$actual_js    = $location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS );
		$actual_css   = $location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS );
		$actual_empty = $location->get_url( $asset, '' );

		$this->assertEquals( $expected_js, $actual_js );
		$this->assertEquals( $expected_css, $actual_css );
		$this->assertEquals( $expected_empty, $actual_empty );
	}
}
