<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Plugin_Suggestions_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Plugin_Availability
	 */
	protected $class_instance;

	/**
	 * @var Yoast_Notification_Center_Double
	 */
	protected $notification_center;

	/**
	 * Set up our double class.
	 */
	public function setUp() {
		parent::setUp();

		$plugin_availability = new WPSEO_Plugin_Availability_Double();

		$notification_center_mock = $this->getMockBuilder( 'Yoast_Notification_Center_Double' )
			->setMethods( array( 'add_notification', 'remove_notification' ) )
			->getMock();

		$this->class_instance = new WPSEO_Suggested_Plugins_Double( $plugin_availability, $notification_center_mock );

		$this->notification_center = $notification_center_mock;
	}

	/**
	 * Tests the adding of a notification when a viable plugin is availble to suggest.
	 */
	public function test_add_notification_for_suggested_plugin() {
		$this->notification_center->expects( $this->once() )->method( 'add_notification' );

		$this->class_instance->add_notifications();
	}

	/**
	 * Tests the removal of a notification when no viable plugin is availble to suggest.
	 */
	public function test_remove_notification_for_suggested_plugin() {
		$this->notification_center->expects( $this->once() )->method( 'remove_notification' );

		$this->class_instance->add_notifications();
	}
}
