<?php
/**
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 */
class WPSEO_Import_AIOSEO_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the importing of GA da when there is a set id.
	 *
	 * @covers WPSEO_Import_AIOSEO::import_ga()
	 * @covers WPSEO_Import_AIOSEO::determine_ga_settings()
	 */
	public function test_import_ga_having_analytics_id() {
		$actual_option = get_option( 'aioseop_options' );

		update_option(
			'aioseop_options',
			array(
				'aiosp_google_analytics_id'        => 12345678,
				'aiosp_ga_use_universal_analytics' => 'on',
				'aiosp_ga_track_outbound_links'    => 'on',
				'aiosp_ga_anonymize_ip'            => 'on',
				'aiosp_ga_exclude_users'           => array(),
			)
		);

		$importer = new WPSEO_Import_AIOSEO();

		$this->assertContains(
			'All in One SEO data successfully imported. Would you like to',
			$importer->msg
		);

		$this->assertContains(
			'update.php?action=install-plugin&#038;plugin=google-analytics-for-wordpress&#038;_wpnonce=',
			$importer->msg
		);

		$this->assertContains(
			'disable the All in One SEO plugin</a>?',
			$importer->msg
		);

		update_option( 'aioseop_options', $actual_option );
	}

	/**
	 * Tests the importing of GA data when there isn't a set id.
	 *
	 * @covers WPSEO_Import_AIOSEO::import_ga()
	 */
	public function test_import_ga_not_having_analytics_id() {
		$actual_option = get_option( 'aioseop_options' );

		update_option( 'aioseop_options', array() );

		$importer = new WPSEO_Import_AIOSEO();

		$this->assertContains(
			'All in One SEO data successfully imported. Would you like to',
			$importer->msg
		);

		$this->assertContains(
			'admin.php?page=wpseo_tools&#038;tool=import-export&#038;deactivate_aioseo=1#top#import-seo',
			$importer->msg
		);

		$this->assertContains(
			'disable the All in One SEO plugin</a>?',
			$importer->msg
		);

		update_option( 'aioseop_options', $actual_option );
	}


}