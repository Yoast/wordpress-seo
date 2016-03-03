<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Interface Yoast_Notification_Center_Interface
 *
 * @since 3.2
 */
interface Yoast_Notification_Center_Interface {
	/**
	 * Get the class instance
	 *
	 * @return self
	 */
	public static function get();

	/**
	 * Display all active and non-dismissed notifications for the current user
	 *
	 * @return void
	 */
	public function display_notifications();

	/**
	 * Return all notifications for an ajax request
	 *
	 * @return void
	 */
	public function ajax_get_notifications();

	/**
	 * Register a notifier
	 *
	 * @param Yoast_Notifier_Interface $notifier Notifier to add to the stack.
	 */
	public function add_notifier( Yoast_Notifier_Interface $notifier );
}
