<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Tests WPSEO_Admin_Asset
 */
final class Test_WPSEO_Admin_Asset_Analysis_Worker_Location extends PHPUnit_Framework_TestCase {

	/**
	 * Tests the get_url function.
	 *
	 * @covers WPSEO_Admin_Asset_Analysis_Worker_Location::get_url()
	 */
	public function test_get_url() {
		$expected_js = home_url() . '/wp-content/plugins/wordpress-seo/js/dist/wp-seo-analysis-worker-test.js';

		$location = new WPSEO_Admin_Asset_Analysis_Worker_Location( 'test' );

		$actual_js = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$actual_null = $location->get_url( $location->get_asset(), null );

		$this->assertEquals( $expected_js, $actual_js );
		$this->assertEquals( $expected_js, $actual_null );
	}
}
