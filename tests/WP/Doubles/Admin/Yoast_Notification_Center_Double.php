<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use Yoast_Notification_Center;

/**
 * Class Yoast_Notification_Center_Double.
 */
class Yoast_Notification_Center_Double extends Yoast_Notification_Center {

	/**
	 * Yoast_Notification_Center_Double constructor.
	 *
	 * This is to override the private constructor in the parent class for mocking purposes.
	 */
	public function __construct() {}

	/**
	 * Checks if there are stored notifications.
	 *
	 * @return bool True when there are stored notifications.
	 */
	public function has_stored_notifications() {
		return parent::has_stored_notifications();
	}

	/**
	 * Removes all notifications from storage.
	 *
	 * @return bool True when notifications got removed.
	 */
	public function remove_storage() {
		return parent::remove_storage();
	}
}
