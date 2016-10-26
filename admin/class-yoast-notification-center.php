<?php
/**
 * @package WPSEO\Admin\Notifications
 */

/**
 * Handles notifications storage and display.
 */
class Yoast_Notification_Center {

	/** Option name to store notifications on */
	const STORAGE_KEY = 'yoast_notifications';

	/** @var \Yoast_Notification_Center The singleton instance of this object */
	private static $instance = null;

	/** @var $notifications Yoast_Notification[] */
	private $notifications = array();

	/** @var array Notifications there are newly added */
	private $new = array();

	/** @var array Notifications that were resolved this execution */
	private $resolved = 0;

	/**
	 * Constructs the Notification center.
	 */
	private function __construct() {

		$this->retrieve_notifications_from_storage();

		add_action( 'all_admin_notices', array( $this, 'display_notifications' ) );

		add_action( 'wp_ajax_yoast_get_notifications', array( $this, 'ajax_get_notifications' ) );

		add_action( 'wpseo_deactivate', array( $this, 'deactivate_hook' ) );
		add_action( 'shutdown', array( $this, 'update_storage' ) );
	}

	/**
	 * Singleton getter
	 *
	 * @return Yoast_Notification_Center
	 */
	public static function get() {

		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Dismisses a notification.
	 */
	public static function ajax_dismiss_notification() {

		$notification_center = self::get();

		$notification_id = filter_input( INPUT_POST, 'notification' );
		if ( empty( $notification_id ) ) {
			die( '-1' );
		}

		$notification = $notification_center->get_notification_by_id( $notification_id );
		if ( false === ( $notification instanceof Yoast_Notification ) ) {

			// Permit legacy.
			$notification = new Yoast_Notification( '', array(
				'id'            => $notification_id,
				'dismissal_key' => $notification_id,
			) );
		}

		if ( $notification_center->maybe_dismiss_notification( $notification ) ) {
			die( '1' );
		}

		die( '-1' );
	}

	/**
	 * Determines if the notification will be dismissed by matching the notification's ID's.
	 *
	 * @param Yoast_Notification $notification The notification to check to see if it will be dismissed.
	 * @param string             $notification_key The notification key to check for to see if dismissal is possible.
	 *
	 * @return bool Returns whether or not the notification is dismissing.
	 */
	public static function is_notification_dismissing( Yoast_Notification $notification, $notification_key ) {
		$dismissal_key = $notification->get_dismissal_key();

		$is_dismissing = ( $dismissal_key === $notification_key );

		if ( ! $is_dismissing ) {
			$is_dismissing = ( $notification_key === $notification->get_id() );
		}

		// Fallback to ?dismissal_key=1&nonce=bla when JavaScript fails.
		if ( ! $is_dismissing ) {
			$is_dismissing = ( $notification_key === '1' );
		}

		return $is_dismissing;
	}

	/**
	 * Checks if the user has dismissed a notification.
	 *
	 * @param Yoast_Notification $notification The notification to check for dismissal.
	 * @param null|int           $user_id      User ID to check on.
	 *
	 * @return bool
	 */
	public static function is_notification_dismissed( Yoast_Notification $notification, $user_id = null ) {

		$user_id       = ( ! is_null( $user_id ) ? $user_id : get_current_user_id() );
		$dismissal_key = $notification->get_dismissal_key();

		$current_value = get_user_meta( $user_id, $dismissal_key, $single = true );

		return ! empty( $current_value );
	}

	/**
	 * Verifies the notification based on a specific nonce.
	 *
	 * @param string $nonce The nonce to verify against.
	 * @param Yoast_Notification $notification The notification to verify.
	 *
	 * @return bool Returns false if the nonce isn't the same or can't be properly verified.
	 */
	public static function verify_nonce( $nonce, $notification ) {
		if ( false === wp_verify_nonce( $nonce, $notification ) ) {
			return false;
		}
	}

	/**
	 * Checks if the nofitication is being dismissed.
	 *
	 * @param string|Yoast_Notification $notification Notification to check dismissal of.
	 * @param string                    $meta_value   Value to set the meta value to if dismissed.
	 * @param string                    $notification_key   The notification key to match against.
	 * @param string                    $user_nonce   The nonce to match against.
	 *
	 * @return bool True if dismissed.
	 */
	public static function maybe_dismiss_notification( Yoast_Notification $notification, $meta_value = 'seen', $notification_key = '', $user_nonce = '' ) {

		// Only persistent notifications are dismissible.
		if ( ! $notification->is_persistent() ) {
			return false;
		}

		// If notification is already dismissed, we're done.
		if ( self::is_notification_dismissed( $notification ) ) {
			return true;
		}

		$notification_id = $notification->get_id();

		// Notification key
		if ( $notification_key === '' ) {
			$notification_key = self::get_user_input( 'notification' );
		}

		if ( ! self::is_notification_dismissing( $notification, $notification_key ) ) {
			return false;
		}

		if ( $user_nonce === '' ) {
			$user_nonce = self::get_user_input( 'nonce' );
		}

		if ( false === wp_verify_nonce( $user_nonce, $notification_id ) ) {
			return false;
		}

		return self::dismiss_notification( $notification, $meta_value );
	}

	/**
	 * Clears dismissal information for the specified Notification.
	 *
	 * When a cause is resolved, the next time it is present we want to show the message again.
	 *
	 * @param string|Yoast_Notification $notification Notification to clear the dismissal of.
	 *
	 * @return bool True if cleared.
	 */
	public function clear_dismissal( $notification ) {

		if ( $notification instanceof Yoast_Notification ) {
			$dismissal_key = $notification->get_dismissal_key();
		}

		if ( is_string( $notification ) ) {
			$dismissal_key = $notification;
		}

		if ( empty( $dismissal_key ) ) {
			return false;
		}

		// Remove notification dismissal for all users.
		$deleted = delete_metadata( 'user', $user_id = 0, $dismissal_key, $meta_value = '', $delete_all = true );

		return $deleted;
	}

	/**
	 * Adds notification to the cookie.
	 *
	 * @param Yoast_Notification $notification Notification object instance.
	 */
	public function add_notification( Yoast_Notification $notification ) {

		// Don't add if the user can't see it.
		if ( ! $notification->display_for_current_user() ) {
			return;
		}

		$notification_id = $notification->get_id();

		// Empty notifications are always added.
		if ( $notification_id !== '' ) {

			// If notification ID exists in notifications, don't add again.
			$present_notification = $this->get_notification_by_id( $notification_id );
			if ( ! is_null( $present_notification ) ) {
				$this->remove_notification( $present_notification, false );
			}

			if ( is_null( $present_notification ) ) {
				$this->new[] = $notification_id;
			}
		}

		// Add to list.
		$this->notifications[] = $notification;
	}

	/**
	 * Gets the notification by ID.
	 *
	 * @param string $notification_id The ID of the notification to search for.
	 *
	 * @return null|Yoast_Notification The proper Yoast_Notification  or null if none is found.
	 */
	public function get_notification_by_id( $notification_id ) {

		foreach ( $this->notifications as & $notification ) {
			if ( $notification_id === $notification->get_id() ) {
				return $notification;
			}
		}

		return null;
	}

	/**
	 * Displays the notifications.
	 */
	public function display_notifications() {

		// Never display notifications for network admin.
		if ( function_exists( 'is_network_admin' ) && is_network_admin() ) {
			return;
		}

		$sorted_notifications = $this->get_sorted_notifications();
		foreach ( $sorted_notifications as $notification ) {
			if ( ! $notification->is_persistent() ) {
				echo $notification;
				$this->remove_notification( $notification );
			}
		}
	}

	/**
	 * Removes notification after it has been displayed.
	 *
	 * @param Yoast_Notification $notification Notification to remove.
	 * @param bool               $resolve Resolve as fixed.
	 */
	public function remove_notification( Yoast_Notification $notification, $resolve = true ) {

		$index = false;

		// Match persistent Notifications by ID, non persistent by item in the array.
		if ( $notification->is_persistent() ) {
			foreach ( $this->notifications as $current_index => $present_notification ) {
				if ( $present_notification->get_id() === $notification->get_id() ) {
					$index = $current_index;
					break;
				}
			}
		}
		else {
			$index = array_search( $notification, $this->notifications, true );
		}

		if ( false === $index ) {
			return;
		}

		if ( $notification->is_persistent() && $resolve ) {
			$this->resolved++;
			$this->clear_dismissal( $notification );
		}

		unset( $this->notifications[ $index ] );
		$this->notifications = array_values( $this->notifications );
	}

	/**
	 * Gets the notification count.
	 *
	 * @param bool $dismissed Count dismissed notifications.
	 *
	 * @return int Number of notifications
	 */
	public function get_notification_count( $dismissed = false ) {

		$notifications = $this->get_notifications();
		$notifications = array_filter( $notifications, array( $this, 'filter_persistent_notifications' ) );

		if ( ! $dismissed ) {
			$notifications = array_filter( $notifications, array( $this, 'filter_dismissed_notifications' ) );
		}

		return count( $notifications );
	}

	/**
	 * Gets the number of notifications resolved this execution.
	 *
	 * These notifications have been resolved and should be counted when active again.
	 *
	 * @return int
	 */
	public function get_resolved_notification_count() {

		return $this->resolved;
	}

	/**
	 * Returns the notifications sorted on type and priority.
	 *
	 * @return array|Yoast_Notification[] Sorted Notifications
	 */
	public function get_sorted_notifications() {

		$notifications = $this->get_notifications();
		if ( empty( $notifications ) ) {
			return array();
		}

		// Sort by severity, error first.
		usort( $notifications, array( $this, 'sort_notifications' ) );

		return $notifications;
	}

	/**
	 * AJAX display notifications.
	 */
	public function ajax_get_notifications() {

		// Display the notices.
		$this->display_notifications();

		// AJAX die.
		exit;
	}

	/**
	 * Removes storage when the plugin is deactivated.
	 */
	public function deactivate_hook() {

		$this->clear_notifications();
	}

	/**
	 * Saves persistent notifications to storage.
	 *
	 * We need to be able to retrieve these so they can be dismissed at any time during the execution.
	 *
	 * @since 3.2
	 *
	 * @return void
	 */
	public function update_storage() {

		$notifications = $this->get_notifications();

		// No notifications to store, clear storage.
		if ( empty( $notifications ) ) {
			$this->remove_storage();

			return;
		}

		$notifications = array_map( array( $this, 'notification_to_array' ), $notifications );

		// Save the notifications to the storage.
		update_user_option( get_current_user_id(), self::STORAGE_KEY, $notifications );
	}

	/**
	 * Provides a way to verify present notifications.
	 *
	 * @return array|Yoast_Notification[] Registered notifications.
	 */
	public function get_notifications() {

		return $this->notifications;
	}

	/**
	 * Gets newly added notifications.
	 *
	 * @return array
	 */
	public function get_new_notifications() {

		return array_map( array( $this, 'get_notification_by_id' ), $this->new );
	}

	/**
	 * Gets information from the User input.
	 *
	 * @param string $key Key to retrieve.
	 *
	 * @return mixed value of key if set.
	 */
	private static function get_user_input( $key ) {

		$filter_input_type = INPUT_GET;
		if ( 'POST' === strtoupper( $_SERVER['REQUEST_METHOD'] ) ) {
			$filter_input_type = INPUT_POST;
		}

		return filter_input( $filter_input_type, $key );
	}

	/**
	 * Retrieves the notifications from storage.
	 *
	 * @return array Yoast_Notification[] Notifications found in storage.
	 */
	private function retrieve_notifications_from_storage() {

		$stored_notifications = get_user_option( self::STORAGE_KEY, get_current_user_id() );

		// Check if notifications are stored.
		if ( empty( $stored_notifications ) ) {
			return;
		}

		if ( is_array( $stored_notifications ) ) {
			$notifications = array_map( array( $this, 'array_to_notification' ), $stored_notifications );
			$notifications = array_filter( $notifications, array( $this, 'filter_notification_current_user' ) );

			$this->notifications = $notifications;
		}
	}

	/**
	 * Sorts notifications on type followed by its priority.
	 *
	 * @param Yoast_Notification $a Compare with B.
	 * @param Yoast_Notification $b Compare with A.
	 *
	 * @return int 1, 0 or -1 for sorting offset.
	 */
	private function sort_notifications( Yoast_Notification $a, Yoast_Notification $b ) {

		$a_type = $a->get_type();
		$b_type = $b->get_type();

		if ( $a_type === $b_type ) {
			return WPSEO_Utils::calc( $b->get_priority(), 'compare', $a->get_priority() );
		}

		if ( 'error' === $a_type ) {
			return -1;
		}

		if ( 'error' === $b_type ) {
			return 1;
		}

		return 0;
	}

	/**
	 * Dismisses the notification.
	 *
	 * @param Yoast_Notification $notification Notification to dismiss.
	 * @param string             $meta_value   Value to save in the dismissal.
	 *
	 * @return bool True if properly dismissed.
	 */
	private static function dismiss_notification( Yoast_Notification $notification, $meta_value = 'seen' ) {
		// Dismiss notification.
		return ( false !== update_user_meta( get_current_user_id(), $notification->get_dismissal_key(), $meta_value ) );
	}

	/**
	 * Removes all notifications from storage.
	 */
	private function remove_storage() {

		delete_user_option( get_current_user_id(), self::STORAGE_KEY );
	}

	/**
	 * Clears locally stored notifications.
	 */
	private function clear_notifications() {

		$this->notifications = array();
	}

	/**
	 * Filters out non-persistent notifications.
	 *
	 * @param Yoast_Notification $notification Notification to test for persistent.
	 *
	 * @since 3.2
	 *
	 * @return bool Whether or not a notification is persistent.
	 */
	private function filter_persistent_notifications( Yoast_Notification $notification ) {

		return $notification->is_persistent();
	}

	/**
	 * Filters out dismissed notifications.
	 *
	 * @param Yoast_Notification $notification Notification to check.
	 *
	 * @return bool Whether or not a notification is dismissed.
	 */
	private function filter_dismissed_notifications( Yoast_Notification $notification ) {

		return ! $this->maybe_dismiss_notification( $notification );
	}

	/**
	 * Converts Notification to array representation.
	 *
	 * @param Yoast_Notification $notification Notification to convert.
	 *
	 * @since 3.2
	 *
	 * @return array The notification as an array representation.
	 */
	private function notification_to_array( Yoast_Notification $notification ) {

		return $notification->to_array();
	}

	/**
	 * Converts stored array to Notification.
	 *
	 * @param array $notification_data Array to convert to Notification.
	 *
	 * @return Yoast_Notification The notification transforment from an array notation.
	 */
	private function array_to_notification( $notification_data ) {

		return new Yoast_Notification(
			$notification_data['message'],
			$notification_data['options']
		);
	}

	/**
	 * Filters notifications that should not be displayed for the current user.
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool Whether or not the notification should be displayed for the current user.
	 */
	private function filter_notification_current_user( Yoast_Notification $notification ) {
		return $notification->display_for_current_user();
	}

	/**
	 * Writes the notifications to a cookie (hooked on shutdown).
	 *
	 * Function renamed to 'update_storage'.
	 *
	 * @deprecated 3.2 remove in 3.5
	 */
	public function set_transient() {
	}
}
