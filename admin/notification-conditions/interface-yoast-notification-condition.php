<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Interface Yoast_Notifier_Interface
 *
 * @since 3.2
 */
interface Yoast_Notification_Condition {
	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is relevant, False if it is no longer present.
	 */
	public function is_met();

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification();

}
