<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Test_Yoast_Notification_Center
 */
class Yoast_Notification_Center_Double extends Yoast_Notification_Center {

	/**
	 * Yoast_Notification_Center_Double constructor.
	 *
	 * This is to override the private constructor in the parent class for mocking purposes.
	 */
	public function __construct() {}
}
