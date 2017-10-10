<?php
/**
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Advanced_Settings_Test extends WPSEO_UnitTestCase {


	/**
	 * Tests that is_yoast_seo_advanced_settings_page returns false when current_page is not advanced settings page, but is a Yoast SEO page.
	 *
	 * @covers WPSEO_Advanced_Settings::is_advanced_settings_page
	 */
	public function test_is_yoast_seo_advanced_settings_page_RETURNS_false_AND_IS_yoast_seo_page() {
		$current_page = 'wpseo_dashboard';

		$this->assertFalse( WPSEO_Advanced_Settings::is_advanced_settings_page( $current_page ) );
	}

	/**
	 * Tests that is_yoast_seo_advanced_settings_page returns false when current_page is not advanced settings page and is not a Yoast SEO page.
	 *
	 * @covers WPSEO_Advanced_Settings::is_advanced_settings_page
	 */
	public function test_is_yoast_seo_advanced_settings_page_RETURNS_false_AND_IS_NOT_yoast_seo_page() {
		$current_page = '';

		$this->assertFalse( WPSEO_Advanced_Settings::is_advanced_settings_page( $current_page ) );
	}

	/**
	 * Tests that is_yoast_seo_advanced_settings_page returns true when current_page is advanced settings page.
	 *
	 * @covers WPSEO_Advanced_Settings::is_advanced_settings_page
	 */
	public function test_is_yoast_seo_advanced_settings_page_RETURNS_true() {
		$current_page = 'wpseo_titles';

		$this->assertTrue( WPSEO_Advanced_Settings::is_advanced_settings_page( $current_page ) );
	}
}
