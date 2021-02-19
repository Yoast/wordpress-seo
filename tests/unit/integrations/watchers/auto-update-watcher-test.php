<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Watchers\Auto_Update_Watcher;

use Yoast_Notification_Center;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;

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
	 * Product_Helper mock.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

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
		$this->product_helper      = Mockery::mock( Product_Helper::class );

		$this->instance = new Auto_Update_Watcher(
			$this->notification_center,
			$this->notification_helper,
			$this->product_helper
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
		self::assertInstanceOf(
			Product_Helper::class,
			self::getPropertyValue( $this->instance, 'product_helper' )
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
	 * Tests handling the notification when toggling the Core auto-updates setting.
	 *
	 * The notification should not be shown.
	 *
	 * @dataProvider provider_toggle_core_no_notification
	 *
	 * @param $core_updates_enabled string The value of the Core auto-updates toggle.
	 * @param $plugins_to_auto_update array The plugins for which auto-updates are enabled.
	 *
	 * @covers ::auto_update_notification_even_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::save_dismissal_status
	 *
	 * @throws Monkey\Expectation\Exception\ExpectationArgsRequired
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
	 * Tests handling the notification when the Core auto-updates setting is toggled to enable auto-updates,
	 * and the Yoast auto-updates setting is disabled,
	 * and the notification has not been dismissed in the past.
	 *
	 * The notification should be shown.
	 *
	 * @covers ::auto_update_notification_even_if_dismissed
	 * @covers ::should_show_notification
	 * @covers ::yoast_auto_updates_enabled
	 * @covers ::maybe_create_notification
	 */
	public function test_auto_update_notification_core_enabled_yoast_disabled() {
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

		// In this test path, the notification should not be created.
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification_object' );

		$this->instance->auto_update_notification_even_if_dismissed();
	}

}
