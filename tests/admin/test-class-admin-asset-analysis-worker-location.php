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
		$suffix = YOAST_ENVIRONMENT === 'development' ? '' : 'min';

		// Default name.
		$expected_js = home_url() . '/wp-content/plugins/wordpress-seo/js/dist/wp-seo-analysis-worker-test.' . $suffix . 'js';
		$location    = new WPSEO_Admin_Asset_Analysis_Worker_Location( 'test' );
		$actual_js   = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$this->assertEquals( $expected_js, $actual_js );
	}

	/**
	 * Tests the get_url function when we pass a name.
	 *
	 * @covers WPSEO_Admin_Asset_Analysis_Worker_Location::get_url()
	 */
	public function test_get_url_with_name() {
		$suffix = YOAST_ENVIRONMENT === 'development' ? '' : 'min';

		$expected_js = home_url() . '/wp-content/plugins/wordpress-seo/js/dist/wp-seo-something-else-version.' . $suffix . 'js';
		$location    = new WPSEO_Admin_Asset_Analysis_Worker_Location( 'version', 'something-else' );
		$actual_js   = $location->get_url( $location->get_asset(), WPSEO_Admin_Asset::TYPE_JS );
		$this->assertEquals( $expected_js, $actual_js );
	}
}
