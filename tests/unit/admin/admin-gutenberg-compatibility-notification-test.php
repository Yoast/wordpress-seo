<?php
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- WPSEO_Admin_Gutenberg_Compatibility_Notification_Test.

/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
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
	 * Holds the WPSEO_Admin_Gutenberg_Compatibility_Notification object.
	 *
	 * @var WPSEO_Admin_Gutenberg_Compatibility_Notification
	 */
	private $gutenberg_notification;

	/**
	 * Set up the mocked dependencies.
	 */
	public function set_up() {
		parent::set_up();

		$this->gutenberg_compatibility_mock = Mockery::mock( 'WPSEO_Gutenberg_Compatibility' )->makePartial();
		$this->notification_center_mock     = Mockery::mock( 'Yoast_Notification_Center' );

		$this->gutenberg_notification = new WPSEO_Admin_Gutenberg_Compatibility_Notification_Double();
		$this->gutenberg_notification->set_dependencies( $this->gutenberg_compatibility_mock, $this->notification_center_mock );
	}

	/**
	 * Tear down the test mocks.
	 */
	public function tear_down() {
		parent::tear_down();
		Mockery::close();
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

		$this->gutenberg_compatibility_mock->allows()->is_installed()->andReturns( $installed );

		$this->gutenberg_compatibility_mock->allows()->is_fully_compatible()->andReturns( $fully_compatible );

		$this->notification_center_mock->expects( 'remove_notification_by_id' )->once()->with( 'wpseo-outdated-gutenberg-plugin' );

		$output = $this->gutenberg_notification->manage_notification();

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
		Monkey\Functions\stubs(
			[
				'__'                  => null,
				'wp_get_current_user' => function() {
					return null;
				},
			]
		);

		$this->gutenberg_compatibility_mock->allows()->is_installed()->andReturns( true );

		$this->gutenberg_compatibility_mock->allows()->is_fully_compatible()->andReturns( false );

		$this->notification_center_mock->expects( 'add_notification' )->once()->withArgs(
			function ( $arg ) {
				// Verify that the added notification is a Yoast_Notification object and has the correct id.
				if ( is_a( $arg, 'Yoast_Notification' ) && $arg->get_id() === 'wpseo-outdated-gutenberg-plugin' ) {
					return true;
				}
				return false;
			}
		);

		$this->gutenberg_notification->manage_notification();
	}
}
