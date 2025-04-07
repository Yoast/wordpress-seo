<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

/**
 * Test class for the is_connected() method, when Site Kit is not active.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::is_connected
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Is_Not_Connected_No_SiteKit_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Let's not activate the Site Kit plugin for this test.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = '';

	/**
	 * Tests is_connected() returns false when Site Kit is not active, even if all the right values are in the DB.
	 *
	 * @return void
	 */
	public function test_is_not_connected() {
		$analytics_4_settings = [
			'accountID'       => '123456789',
			'propertyID'      => '12345',
			'webDataStreamID' => '1234',
			'measurementID'   => 'G-123456789',
		];
		\update_option( 'googlesitekit_analytics-4_settings', $analytics_4_settings );

		$is_connected = $this->instance->is_connected();

		$this->assertFalse( $is_connected );
	}
}
