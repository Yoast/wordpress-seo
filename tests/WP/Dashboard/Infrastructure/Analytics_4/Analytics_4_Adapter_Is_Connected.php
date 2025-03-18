<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

/**
 * Test class for the is_connected() method.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::is_connected
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Is_Connected extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests is_connected() returns true.
	 *
	 * @return void
	 */
	public function test_is_connected() {
		$analytics_4_settings = [
			'accountID'       => '123456789',
			'propertyID'      => '12345',
			'webDataStreamID' => '1234',
			'measurementID'   => 'G-123456789',
		];
		\update_option( 'googlesitekit_analytics-4_settings', $analytics_4_settings );

		$is_connected = $this->instance->is_connected();

		$this->assertTrue( $is_connected );
	}

	/**
	 * Tests is_connected() returns false.
	 *
	 * @return void
	 */
	public function test_is_not_connected() {
		$analytics_4_settings = [
			'accountID'       => '',
			'propertyID'      => '',
			'webDataStreamID' => '',
			'measurementID'   => '',
		];
		\update_option( 'googlesitekit_analytics-4_settings', $analytics_4_settings );

		$is_connected = $this->instance->is_connected();

		$this->assertFalse( $is_connected );
	}
}
