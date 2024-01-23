<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Watchers\Auto_Update_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Auto_Update_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Auto_Update_Watcher
 */
final class Auto_Update_Watcher_Test extends TestCase {

	/**
	 * Yoast_Notification_Center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The instance under test.
	 *
	 * @var Auto_Update_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Auto_Update_Watcher(
			$this->notification_center
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
	}

	/**
	 * Tests registering the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_init' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the removal of the notification.
	 *
	 * @covers ::remove_notification
	 *
	 * @return void
	 */
	public function test_remove_notification() {
		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once();

		$this->instance->remove_notification();
	}
}
