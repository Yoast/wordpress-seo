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

//	/**
//	 * @return void garbage
//	 */
//	public function test_called_at_all() {
//		$this->assertEquals( 3, 1 + 2 );
//	}

	/**
	 * @return void
	 *
	 * @covers WPSEO_Addon_Manager::get_myyoast_site_information
	 */
	public function test_finds_no_licenses_for_site_without_any_licenses() {
		$site = 'https://thisDoesNotHaveAnyLicensesForeverNoBacksies.com';
		update_option( 'home', $site  );

		$addon_manager = new WPSEO_Addon_Manager();
		$addons = $addon_manager->get_myyoast_site_information();

		var_dump( $addons );

		$expected_site_information = (object) [
			'url'           => $site,
			'subscriptions' => [],
		];

		$this->assertEquals( $addons, $expected_site_information );
	}
}
