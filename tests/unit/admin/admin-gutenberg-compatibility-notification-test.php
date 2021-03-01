<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\Doubles\Admin\WPSEO_Admin_Gutenberg_Compatibility_Notification_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class
 *
 * @group MyYoast
 *
 * @coversDefaultClass WPSEO_Admin_Gutenberg_Compatibility_Notification
 */
class WPSEO_Admin_Gutenberg_Compatibility_Notification_Test extends TestCase {

	/**
	 * Holds the WPSEO_Gutenberg_Compatibility mock instance.
	 *
	 * @var WPSEO_Gutenberg_Compatibility
	 */
	private $gutenberg_compatibility_mock;

	/**
	 * Holds the Yoast_Notification_Center mock instance.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center_mock;

	/**
	 * Set up the mocked dependencies.
	 */
	public function setUp() {
		parent::setUp();

		$this->gutenberg_compatibility_mock = $this
			->getMockBuilder( 'WPSEO_Gutenberg_Compatibility' )
			->setMethods( [ 'is_installed', 'is_fully_compatible' ] )
			->getMock();

		$this->notification_center_mock = $this
			->getMockBuilder( 'Yoast_Notification_Center_Double' )
			->setMethods( [ 'remove_notification_by_id' ] )
			->getMock();
	}

	/**
	 * Tests the conditions that remove the Gutenberg notification.
	 *
	 * @param bool $installed        The return value of WPSEO_Gutenberg_Compatibility::is_installed.
	 * @param bool $fully_compatible The return value of WPSEO_Gutenberg_Compatibility::is_fully_compatible.
	 * @param bool $filter_value     The return value of the 'yoast_display_gutenberg_compat_notification' filter.
	 *
	 * @covers WPSEO_Admin_Gutenberg_Compatibility_Notification::manage_notification
	 *
	 * @dataProvider data_provider_manage_notification_remove_notification
	 */
	public function test_manage_notification_remove_notification( $installed, $fully_compatible, $filter_value ) {

		if ( ! $filter_value ) {
			// Set the filter's return value to false.
			Monkey\Filters\expectApplied( 'yoast_display_gutenberg_compat_notification' )
				->once()
				->andReturn( false );
		}

		$this->gutenberg_compatibility_mock->method( 'is_installed' )
			->willReturn( $installed );

		$this->gutenberg_compatibility_mock->method( 'is_fully_compatible' )
			->willReturn( $fully_compatible );

		$this->notification_center_mock->expects( $this->once() )
			->method( 'remove_notification_by_id' );

		$gutenberg_notification = new WPSEO_Admin_Gutenberg_Compatibility_Notification_Double();
		$gutenberg_notification->set_dependencies( $this->gutenberg_compatibility_mock, $this->notification_center_mock );

		$output = $gutenberg_notification->manage_notification();
		$this->assertNull( $output );
	}

	/**
	 * Test data provider for the test_manage_notification_remove_notification test method.
	 *
	 * @return array
	 */
	public function data_provider_manage_notification_remove_notification() {
		return [
			'filter is false'  => [
				'installed'        => true,
				'fully compatible' => false,
				'filter_value'     => false,
			],
			'not installed'    => [
				'installed'        => false,
				'fully compatible' => false,
				'filter_value'     => true,
			],
			'fully compatible' => [
				'installed'        => true,
				'fully compatible' => true,
				'filter_value'     => true,
			],
		];
	}

	/**
	 * Tests the condition that adds the Gutenberg compatibility notification.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::get_installed_version
	 */
	public function test_manage_notification_gutenberg_show_notification() {
		$this->gutenberg_compatibility_mock->method( 'is_installed' )
			->willReturn( true );

		$this->gutenberg_compatibility_mock->method( 'is_fully_compatible' )
			->willReturn( false );

		$notification = $this
			->getMockBuilder( 'WPSEO_Admin_Gutenberg_Compatibility_Notification_Double' )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$notification->set_dependencies( $this->gutenberg_compatibility_mock, $this->notification_center_mock );
		$notification->expects( $this->once() )
			->method( 'add_notification' );

		$notification->manage_notification();
	}
}
