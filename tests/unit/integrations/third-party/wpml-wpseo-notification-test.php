<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\WPML_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Third_Party\WPML_WPSEO_Notification;

use Yoast_Notification_Center;
use Yoast\WP\SEO\Conditionals\Third_Party\WPML_WPSEO_Conditional;

/**
 * WPML_WPSEO_Notification test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WPML_WPSEO_Notification
 */
class WPML_WPSEO_Notification_Test extends TestCase {

	/**
	 * Yoast_Notification_Center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * WPML_WPSEO_Conditional mock.
	 *
	 * @var Mockery\MockInterface|WPML_WPSEO_Conditional
	 */
	protected $wpml_wpseo_conditional;

	/**
	 * Mock of the short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Instance under test.
	 *
	 * @var WPML_WPSEO_Notification
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();
		$this->short_link_helper      = Mockery::mock( Short_Link_Helper::class );
		$this->notification_center    = Mockery::mock( Yoast_Notification_Center::class );
		$this->wpml_wpseo_conditional = Mockery::mock( WPML_WPSEO_Conditional::class );
		$this->instance               = new WPML_WPSEO_Notification(
			$this->short_link_helper,
			$this->notification_center,
			$this->wpml_wpseo_conditional
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertAttributeInstanceOf(
			Yoast_Notification_Center::class,
			'notification_center',
			$this->instance
		);
		self::assertAttributeInstanceOf(
			WPML_WPSEO_Conditional::class,
			'wpml_wpseo_conditional',
			$this->instance
		);
	}

	/**
	 * Tests whether the right hooks and actions are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_registers_the_right_hooks() {
		Monkey\Actions\expectAdded( 'admin_notices' )
			->with( [ $this->instance, 'notify_not_installed' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests whether the right conditionals are set
	 * for the integration to load. E.g. when the WPML plugin is active.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_conditionals() {
		$expected = [ WPML_Conditional::class ];
		self::assertSame( $expected, WPML_WPSEO_Notification::get_conditionals() );
	}

	/**
	 * Tests whether the notification is added when the Yoast SEO Multilingual plugin
	 * is not installed and activated.
	 *
	 * @covers ::notify_not_installed
	 * @covers ::notification
	 */
	public function test_notifies_when_not_installed() {
		// Mock that the Yoast SEO Multilingual plugin is not installed and activated.
		$this->wpml_wpseo_conditional->expects( 'is_met' )->andReturnFalse();

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->withAnyArgs()
			->once();

		$this->short_link_helper->expects( 'get' )
			->with( 'https://yoa.st/wpml-yoast-seo' );

		$this->instance->notify_not_installed();
	}

	/**
	 * Tests whether the notification is added when the Yoast SEO Multilingual plugin
	 * is not installed and activated.
	 *
	 * @covers ::notify_not_installed
	 * @covers ::notification
	 */
	public function test_does_not_notify_when_installed() {
		// Mock that Yoast SEO Multilingual plugin is installed and activated.
		$this->wpml_wpseo_conditional->expects( 'is_met' )->andReturnTrue();

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->with( WPML_WPSEO_Notification::NOTIFICATION_ID )
			->once();

		$this->instance->notify_not_installed();
	}
}
