<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Watchers\Auto_Update_Watcher;

use Yoast_Notification_Center;
use Yoast\WP\SEO\Helpers\Notification_Helper;

/**
 * Class Auto_Update_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Auto_Update_Watcher
 */
class Auto_Update_Watcher_Test extends TestCase {

	/**
	 * Yoast_Notification_Center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Notification_Helper mock.
	 *
	 * @var Mockery\MockInterface|Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * The instance under test.
	 *
	 * @var Auto_Update_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->notification_helper = Mockery::mock( Notification_Helper::class );

		$this->instance = new Auto_Update_Watcher(
			$this->notification_center,
			$this->notification_helper
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertInstanceOf(
			Yoast_Notification_Center::class,
			self::getPropertyValue( $this->instance, 'notification_center' )
		);
		self::assertInstanceOf(
			Notification_Helper::class,
			self::getPropertyValue( $this->instance, 'notification_helper' )
		);
	}

	/**
	 * Tests registering the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_init' );
		Monkey\Actions\expectAdded( 'update_option_auto_update_core_major' );
		Monkey\Actions\expectAdded( 'update_option_auto_update_plugins' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests handling the notification when toggling the Core auto-updates setting,
	 * in various combinations where the notification should not be shown.
	 *
	 * @dataProvider provider_toggle_core_no_notification
	 *
	 * @param string $core_updates_enabled   The value of the Core auto-updates toggle.
	 * @param array  $plugins_to_auto_update The plugins for which auto-updates are enabled.
	 *
	 * @covers ::auto_update_notification_even_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::save_dismissal_status
	 */
	public function test_toggle_core_auto_updates_no_notification( $core_updates_enabled, $plugins_to_auto_update ) {
		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_core_major' )
			->once()
			->andReturn( $core_updates_enabled );

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->once()
			->andReturn( $plugins_to_auto_update );

		// The notification has not been dismissed in the past.
		Monkey\Functions\expect( 'get_user_option' )
			->with( 'wp_wpseo-auto-update' )
			->once()
			->andReturn( false );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once();

		// The notification should not be created.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->never();

		$this->instance->auto_update_notification_even_if_dismissed();
	}

	/**
	 * Data provider for test_toggling_core_auto_updates_no_notification.
	 *
	 * Provides scenarios in which no notification should be shown.
	 *
	 * @return array
	 */
	public function provider_toggle_core_no_notification() {
		return [
			[ 'enabled', [ 'wordpress-seo/wp-seo.php', 'another_plugin_file' ] ],
			[ 'disabled', [ 'wordpress-seo/wp-seo.php', 'another_plugin_file' ] ],
			[ 'disabled', [ 'not_yoast_seo', 'another_plugin_file' ] ],
			[ 'disabled', [] ],
		];
	}

	/**
	 * Tests handling the notification when enabling the Core auto-updates setting,
	 * when Yoast SEO auto-updates are disabled,
	 * so the notification should be shown (and it has already been created).
	 *
	 * @covers ::auto_update_notification_even_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::maybe_create_notification
	 */
	public function test_auto_update_notification_enable_core_while_yoast_disabled() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_core_major' )
			->once()
			->andReturn( 'enabled' );

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->once()
			->andReturn( [ 'not_yoast_seo', 'another_plugin_file' ] );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->never();

		// The notification already exists, and does not have to be created.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification_object' );

		$this->instance->auto_update_notification_even_if_dismissed();
	}

	/**
	 * Tests handling the notification when enabling the Core auto-updates setting,
	 * when Yoast SEO auto-updates are disabled,
	 * so the notification should be shown (and it has not yet been created).
	 *
	 * @covers ::auto_update_notification_even_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::maybe_create_notification
	 * @covers ::notification
	 */
	public function test_auto_update_notification_enable_core_while_yoast_disabled_create_notification() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_core_major' )
			->once()
			->andReturn( 'enabled' );

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->once()
			->andReturn( [ 'not_yoast_seo', 'another_plugin_file' ] );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->never();

		// The notification does not yet exist, and should be created.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_helper
			->expects( 'restore_notification' )
			->once();

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->auto_update_notification_even_if_dismissed();
	}

	/**
	 * Tests handling the notification when enabling the Yoast SEO auto-updates setting,
	 * when Core auto-updates are enabled,
	 * so the notification should not be shown,
	 * and save the fact that it has been dismissed in the past.
	 *
	 * @covers ::auto_update_notification_not_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::save_dismissal_status
	 * @covers ::maybe_remove_notification
	 */
	public function test_auto_update_notification_enable_yoast_while_core_enabled_save_dismiss_status() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_core_major' )
			->once()
			->andReturn( 'enabled' );

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->once()
			->andReturn( [ 'wordpress-seo/wp-seo.php', 'another_plugin_file' ] );

		// The notification has not been dismissed in the past.
		Monkey\Functions\expect( 'get_user_option' )
			->with( 'wp_wpseo-auto-update' )
			->once()
			->andReturn( 'seen' );

		Monkey\Functions\expect( 'get_user_option' )
			->with( 'wp_wpseo-auto-update_dismissed' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'get_current_user_id' )
			->withNoArgs()
			->once()
			->andReturn( 'the_user_id' );

		Monkey\Functions\expect( 'update_user_option' )
			->once();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once();

		// The notification should not be created.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->never();

		$this->instance->auto_update_notification_not_if_dismissed();
	}

	/**
	 * Tests handling the notification when disabling the Yoast SEO auto-updates setting,
	 * when Core auto-updates are enabled,
	 * and the notification has not been dismissed before,
	 * so the notification should be shown (and it has already been created).
	 *
	 * @covers ::auto_update_notification_not_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::maybe_create_notification_if_not_dismissed
	 */
	public function test_auto_update_notification_disable_yoast_while_core_enabled() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_core_major' )
			->once()
			->andReturn( 'enabled' );

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->twice()
			->andReturn( [ 'not_yoast_seo', 'another_plugin_file' ] );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->never();

		// The option has not been dismissed in the past.
		Monkey\Functions\expect( 'get_user_option' )
			->with( 'wp_wpseo-auto-update_dismissed' )
			->once()
			->andReturn( false );

		// The notification already exists, and does not have to be created.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification_object' );

		$this->instance->auto_update_notification_not_if_dismissed();
	}

	/**
	 * Tests handling the notification when disabling the Yoast SEO auto-updates setting,
	 * when Core auto-updates are enabled,
	 * and the notification has been dismissed before,
	 * so the notification it should not be shown.
	 *
	 * @covers ::auto_update_notification_not_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::maybe_create_notification_if_not_dismissed
	 */
	public function test_auto_update_notification_disable_yoast_while_core_enabled_notification_dismissed() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_core_major' )
			->once()
			->andReturn( 'enabled' );

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->twice()
			->andReturn( [ 'not_yoast_seo', 'another_plugin_file' ] );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->never();

		// The option has been dismissed in the past.
		Monkey\Functions\expect( 'get_user_option' )
			->with( 'wp_wpseo-auto-update_dismissed' )
			->once()
			->andReturn( '1' );

		// The notification should not be created, because it was dismissed in the past.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->never();

		$this->instance->auto_update_notification_not_if_dismissed();
	}
}
