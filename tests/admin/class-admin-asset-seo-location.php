<?php


final class Test_WPSEO_Admin_Asset_SEO_Location extends PHPUnit_Framework_TestCase {

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
		$expected_js = home_url() . '/wp-content/plugins/wordpress-seo/js/dist/src.suffix.js';
		$expected_css = home_url() . '/wp-content/plugins/wordpress-seo/css/dist/src.suffix.css';
		$expected_empty = '';

		$actual_js = $asset->get_url( WPSEO_Admin_Asset::TYPE_JS, WPSEO_FILE );
		$actual_css = $asset->get_url( WPSEO_Admin_Asset::TYPE_CSS, WPSEO_FILE );
		$actual_empty = $asset->get_url( '', '' );

		$this->assertEquals( $expected_js, $actual_js );
		$this->assertEquals( $expected_css, $actual_css );
		$this->assertEquals( $expected_empty, $actual_empty );
	}
}
