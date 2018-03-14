<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Suggested_Plugins_Double
 */
class WPSEO_Suggested_Plugins_Double extends WPSEO_Suggested_Plugins {

	/**
	 * WPSEO_Suggested_Plugins_Double constructor.
	 *
	 * @param WPSEO_Plugin_Availability $availability_checker The availability checker to use.
	 * @param Yoast_Notification_Center $notification_center The notification center to add notifications to.
	 */
	public function __construct( WPSEO_Plugin_Availability $availability_checker, Yoast_Notification_Center $notification_center ) {
		$this->availability_checker = $availability_checker;
		$this->notification_center  = $notification_center;
		$this->register_hooks();
	}

	/**
	 * Immediately execute the hooks for testing purposes.
	 */
	public function register_hooks() {
		$this->availability_checker->register();
		$this->add_notifications();
	}
}
