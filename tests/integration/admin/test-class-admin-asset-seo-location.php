<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Tests WPSEO_Admin_Asset.
 */
final class WPSEO_Admin_Asset_SEO_Location_Test extends TestCase {

	/**
	 * Tests the get_url function.
	 *
	 * @covers WPSEO_Admin_Asset_SEO_Location::get_url
	 */
	public function test_get_url() {
		$asset_args = [
			'name'      => 'name',
			'src'       => 'src',
			'deps'      => [ 'deps' ],
			'version'   => 'version',
			'media'     => 'screen',
			'in_footer' => false,
			'rtl'       => false,
		];
		$asset      = new WPSEO_Admin_Asset( $asset_args );

		$expected_js    = home_url() . '/wp-content/plugins/wordpress-seo/js/dist/src.js';
		$expected_css   = home_url() . '/wp-content/plugins/wordpress-seo/css/dist/src.css';
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
