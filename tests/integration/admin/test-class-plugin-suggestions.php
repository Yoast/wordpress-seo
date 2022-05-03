<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Suggested_Plugins
 */
class WPSEO_Plugin_Suggestions_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Suggested_Plugins_Double
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
	 */
	public function set_up() {
		parent::set_up();

		$plugin_availability = new WPSEO_Plugin_Availability_Double();

		/*
		 * Silencing errors for PHP 7.4 in combination with the Mock Builder.
		 * See {@see `Yoast_SEO_ReflectionToString_Deprecation_Handler`} for context.
		 *
		 * phpcs:disable WordPress.PHP.NoSilencedErrors.Discouraged
		 */
		@$notification_center_mock = $this->getMockBuilder( 'Yoast_Notification_Center_Double' )
			->setMethods( [ 'add_notification', 'remove_notification' ] )
			->getMock();
		// phpcs:enable

		$this->class_instance = new WPSEO_Suggested_Plugins_Double( $plugin_availability, $notification_center_mock );

		$this->notification_center = $notification_center_mock;
	}

	/**
	 * Tests the adding of a notification when a viable plugin is available to suggest.
	 *
	 * @covers ::add_notifications
	 */
	public function test_add_notification_for_suggested_plugin() {
		$this->notification_center->expects( $this->once() )->method( 'add_notification' );

		$this->class_instance->add_notifications();
	}

	/**
	 * Tests the removal of a notification when no viable plugin is available to suggest.
	 *
	 * @covers ::add_notifications
	 */
	public function test_remove_notification_for_suggested_plugin() {
		$this->notification_center->expects( $this->once() )->method( 'remove_notification' );

		$this->class_instance->add_notifications();
	}
}
