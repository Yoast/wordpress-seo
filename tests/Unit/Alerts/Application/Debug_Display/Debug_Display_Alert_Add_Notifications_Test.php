<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Debug_Display;

use Brain\Monkey\Functions;
use Generator;
use Mockery;
use WP_User;
use Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert;

/**
 * Test class adding notifications.
 *
 * @group Debug_Display
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::add_notifications
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::should_show_notification
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::get_notification
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::get_message
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Debug_Display_Alert_Add_Notifications_Test extends Abstract_Debug_Display_Alert_Test {

	/**
	 * Tests adding notifications.
	 *
	 * @dataProvider add_notifications_data
	 *
	 * @param bool   $is_production             Whether the site is in production mode.
	 * @param bool   $is_debug_display_enabled  Whether debug display is enabled.
	 * @param int    $remove_notification_times The number of times we are removing a notification.
	 * @param int    $add_notification_times    The number of times we are adding a notification.
	 * @param string $expected_message          The expected notification message.
	 *
	 * @return void
	 */
	public function test_add_notifications(
		$is_production,
		$is_debug_display_enabled,
		$remove_notification_times,
		$add_notification_times,
		$expected_message
	) {
		$admin_user     = Mockery::mock( WP_User::class );
		$admin_user->ID = 1;

		Functions\expect( 'get_current_user_id' )
			->andReturn( $admin_user->ID );

		$instance = Mockery::mock(
			Debug_Display_Alert::class,
			[
				$this->notification_center,
				$this->environment_helper,
			],
		)->makePartial()->shouldAllowMockingProtectedMethods();

		$this->environment_helper
			->expects( 'is_production_mode' )
			->once()
			->andReturn( $is_production );

		if ( $is_production ) {
			$instance
				->expects( 'is_debug_display_enabled' )
				->once()
				->andReturn( $is_debug_display_enabled );
		}
		else {
			$instance
				->expects( 'is_debug_display_enabled' )
				->never();
		}

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->times( $remove_notification_times )
			->with( 'wpseo-debug-display-enabled' );

		$this->notification_center
			->expects( 'add_notification' )
			->times( $add_notification_times )
			->withArgs(
				static function ( $notification ) use ( $expected_message ) {
					$notification_array = $notification->to_array();
					$options            = $notification_array['options'];

					return $notification_array['message'] === $expected_message
						&& $options['id'] === 'wpseo-debug-display-enabled'
						&& $options['type'] === 'warning'
						&& $options['capabilities'] === [ 'wpseo_manage_options' ];
				},
			);

		$instance->add_notifications();
	}

	/**
	 * Data provider for the test_add_notifications test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function add_notifications_data() {
		$expected_message = '<strong>SEO issue: PHP debug output may be visible on your site.</strong> Your site is running with WP_DEBUG and WP_DEBUG_DISPLAY enabled. Error messages can appear on the frontend and get indexed by search engines. In wp-config.php, set WP_DEBUG_DISPLAY to false (and prefer WP_DEBUG_LOG if you still need debugging). <a href="https://wordpress.org/documentation/article/debugging-in-wordpress/" target="_blank" rel="noopener noreferrer">Learn more about debugging in WordPress</a>.';

		yield 'Production with debug display - adds notification' => [
			'is_production'             => true,
			'is_debug_display_enabled'  => true,
			'remove_notification_times' => 0,
			'add_notification_times'    => 1,
			'expected_message'          => $expected_message,
		];

		yield 'Production with debug display off - removes notification' => [
			'is_production'             => true,
			'is_debug_display_enabled'  => false,
			'remove_notification_times' => 1,
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];

		yield 'Non-production with debug display - removes notification' => [
			'is_production'             => false,
			'is_debug_display_enabled'  => true,
			'remove_notification_times' => 1,
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];
	}
}
