<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Woocommerce_Beta_Editor_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Woocommerce_Beta_Editor_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Woocommerce_Beta_Editor_Watcher
 */
final class Woocommerce_Beta_Editor_Watcher_Test extends TestCase {

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
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|WooCommerce_Conditional
	 */
	protected $woocommerce_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Woocommerce_Beta_Editor_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->notification_center     = Mockery::mock( Yoast_Notification_Center::class );
		$this->notification_helper     = Mockery::mock( Notification_Helper::class );
		$this->short_link_helper       = Mockery::mock( Short_Link_Helper::class );
		$this->woocommerce_conditional = Mockery::mock( WooCommerce_Conditional::class );

		$this->instance = new Woocommerce_Beta_Editor_Watcher(
			$this->notification_center,
			$this->notification_helper,
			$this->short_link_helper,
			$this->woocommerce_conditional
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
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
			Short_Link_Helper::class,
			self::getPropertyValue( $this->instance, 'short_link_helper' )
		);
	}

	/**
	 * Tests that the integration is loaded under the right conditions.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		self::assertEquals( [ Admin_Conditional::class, Not_Admin_Ajax_Conditional::class ], Woocommerce_Beta_Editor_Watcher::get_conditionals() );
	}

	/**
	 * Tests registering the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'admin_init', [ $this->instance, 'manage_woocommerce_beta_editor_notification' ] ) );
	}

	/**
	 * Tests the admin_init callback when woocommerce_beta_editor is disabled.
	 *
	 * @covers ::manage_woocommerce_beta_editor_notification
	 *
	 * @return void
	 */
	public function test_manage_woocommerce_beta_editor_disable() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'woocommerce_feature_product_block_editor_enabled' )
			->andReturn( 'no' );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( 'wpseo-woocommerce-beta-editor-warning' );

		$this->instance->manage_woocommerce_beta_editor_notification();
	}

	/**
	 * Tests the admin_init callback when woocommerce_beta_editor is enabled with active notification.
	 *
	 * @covers ::manage_woocommerce_beta_editor_notification
	 *
	 * @return void
	 */
	public function test_manage_woocommerce_beta_editor_notification_active_and_enable() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'woocommerce_feature_product_block_editor_enabled' )
			->andReturn( 'yes' );

		$this->woocommerce_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->with( 'wpseo-woocommerce-beta-editor-warning' )
			->andReturn( true );

		$this->instance->manage_woocommerce_beta_editor_notification();
	}

	/**
	 * Tests the admin_init callback when woocommerce_beta_editor is enabled with active notification, but WooCommerce is not enabled.
	 *
	 * @covers ::manage_woocommerce_beta_editor_notification
	 *
	 * @return void
	 */
	public function test_manage_woocommerce_beta_editor_notification_active_and_enable_but_woo_inactive() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'woocommerce_feature_product_block_editor_enabled' )
			->andReturn( 'yes' );

		$this->woocommerce_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->never();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( 'wpseo-woocommerce-beta-editor-warning' );

		$this->instance->manage_woocommerce_beta_editor_notification();
	}

	/**
	 * Tests the admin_init callback when woocommerce_beta_editor is enabled with no active notification.
	 *
	 * @covers ::manage_woocommerce_beta_editor_notification
	 * @covers ::notification
	 *
	 * @return void
	 */
	public function test_manage_woocommerce_beta_editor_notification_not_active_and_enable() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'woocommerce_feature_product_block_editor_enabled' )
			->andReturn( 'yes' );

		$this->woocommerce_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->with( 'wpseo-woocommerce-beta-editor-warning' )
			->andReturn( false );

		Monkey\Functions\expect( 'esc_url' )
			->once();

		$this->short_link_helper
			->expects( 'get' )
			->once()
			->with( 'https://yoa.st/learn-how-disable-beta-woocommerce-product-editor' )
			->andReturn( 'https://yoa.st/learn-how-disable-beta-woocommerce-product-editor' );

		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		$this->notification_helper
			->expects( 'restore_notification' )
			->once();

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->manage_woocommerce_beta_editor_notification();
	}
}
