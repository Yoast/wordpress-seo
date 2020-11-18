<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\WPML_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Third_Party\WPSEOML_Notification;

use Yoast_Notification_Center;
use Yoast\WP\SEO\Conditionals\Third_Party\WPSEOML_Conditional;

/**
 * WPSEOML_Notification test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WPSEOML_Notification
 */
class WPSEOML_Notification_Test extends TestCase {

	/**
	 * Yoast_Notification_Center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * WPSEOML_Conditional mock.
	 *
	 * @var Mockery\MockInterface|WPSEOML_Conditional
	 */
	protected $wpseoml_conditional;

	/**
	 * Instance under test.
	 *
	 * @var WPSEOML_Notification
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->wpseoml_conditional = Mockery::mock( WPSEOML_Conditional::class );
		$this->instance            = new WPSEOML_Notification(
			$this->notification_center,
			$this->wpseoml_conditional
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
			WPSEOML_Conditional::class,
			'wpseoml_conditional',
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
		self::assertSame( $expected, WPSEOML_Notification::get_conditionals() );
	}

	/**
	 * Tests whether the notification is added when the WPSEOML plugin
	 * is not installed and activated.
	 *
	 * @covers ::notify_not_installed
	 * @covers ::notification
	 */
	public function test_notifies_when_not_installed() {
		// Mock that WPSEOML is not installed and activated.
		$this->wpseoml_conditional->expects( 'is_met' )->andReturnFalse();

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->withAnyArgs()
			->once();

		$this->instance->notify_not_installed();
	}

	/**
	 * Tests whether the notification is added when the WPSEOML plugin
	 * is not installed and activated.
	 *
	 * @covers ::notify_not_installed
	 * @covers ::notification
	 */
	public function test_does_not_notify_when_installed() {
		// Mock that WPSEOML is installed and activated.
		$this->wpseoml_conditional->expects( 'is_met' )->andReturnTrue();

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->with( WPSEOML_Notification::NOTIFICATION_ID )
			->once();

		$this->instance->notify_not_installed();
	}
}
