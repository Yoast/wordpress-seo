<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 *
 * @group MyYoast
 */
class WPSEO_addon_manager_test extends WPSEO_UnitTestCase {

	/**
	 * This test assumes that, on my.yoast.com. There is no active license for a registered site with url:
	 * https://thisDoesNotHaveAnyLicensesForeverNoBacksies.com
	 *
	 * @covers WPSEO_Addon_Manager::get_myyoast_site_information
	 */
	public function test_finds_no_licenses_for_site_without_any_licenses() {
		$site = 'https://thisDoesNotHaveAnyLicensesForeverNoBacksies.com';
		update_option( 'home', $site  );

		$addon_manager = new WPSEO_Addon_Manager();
		$actual = $addon_manager->get_myyoast_site_information();

		$expected_site_information = (object) [
			'url'           => $site,
			'subscriptions' => [],
		];

		$this->assertEquals( $actual, $expected_site_information );
	}

	/**
	 * This test assumes that, on my.yoast.com. There is an active license for all plugins for our blog.:
	 *
	 * @covers WPSEO_Addon_Manager::get_myyoast_site_information
	 */
	public function test_finds_all_licenses_for_yoast_dot_com() {
		$site = 'https://yoast.com';
		update_option( 'home', $site  );

		$addon_manager = new WPSEO_Addon_Manager();
		$actual = $addon_manager->get_myyoast_site_information();

		// Might be nicer to put the entire expected blob here. But wanted to put something here that does not fail at the slightest change in interface.
		$expected_slugs = [ "yoast-seo-local", "yoast-seo-video", "yoast-seo-woocommerce", "yoast-seo-news", "yoast-seo-wordpress-premium" ];

		$slugs = array_map( function( $subscription ) {
			return $subscription->product->slug;
		}, $actual->subscriptions );

		$this->assertEquals( $expected_slugs, $slugs );
	}
}
