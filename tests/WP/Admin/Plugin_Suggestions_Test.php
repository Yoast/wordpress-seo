<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Plugin_Availability_Double;
use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Suggested_Plugins_Double;
use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Yoast_Notification_Center_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Suggested_Plugins
 */
final class Plugin_Suggestions_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Suggested_Plugins_Double
	 */
	protected $class_instance;

	/**
	 * Holds the instance of the notification center (double).
	 *
	 * @var Yoast_Notification_Center_Double
	 */
	protected $notification_center;

	/**
	 * Set up our double class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$plugin_availability = new Plugin_Availability_Double();

		$notification_center_mock = $this->getMockBuilder( Yoast_Notification_Center_Double::class )
			->setMethods( [ 'add_notification', 'remove_notification_by_id' ] )
			->getMock();

		$this->class_instance = new Suggested_Plugins_Double( $plugin_availability, $notification_center_mock );

		$this->notification_center = $notification_center_mock;
	}

	/**
	 * Tests the adding of a notification when a viable plugin is available to suggest.
	 *
	 * @covers ::add_notifications
	 *
	 * @return void
	 */
	public function test_add_notification_for_suggested_plugin() {
		$this->notification_center->expects( $this->once() )->method( 'add_notification' );

		$this->class_instance->add_notifications();
	}

	/**
	 * Tests the removal of a notification when no viable plugin is available to suggest.
	 *
	 * @covers ::add_notifications
	 *
	 * @return void
	 */
	public function test_remove_notification_for_suggested_plugin() {
		$this->notification_center->expects( $this->once() )->method( 'remove_notification_by_id' );

		$this->class_instance->add_notifications();
	}
}
