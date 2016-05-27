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

	/** @var array Notifications that were added this execution */
	private $touched = array();

	/** @var bool Remove untouched notification if we have never reached admin_init */
	private $remove_untouched = false;

	/**
	 * Construct
	 */
	private function __construct() {

		$this->retrieve_notifications_from_storage();

		add_action( 'admin_init', array( $this, 'enable_remove_untouched' ) );
		add_action( 'all_admin_notices', array( $this, 'display_notifications' ) );

		add_action( 'wp_ajax_yoast_get_notifications', array( $this, 'ajax_get_notifications' ) );

		add_action( 'wpseo_deactivate', array( $this, 'deactivate_hook' ) );
		add_action( 'shutdown', array( $this, 'update_storage' ) );
		add_action( 'shutdown', array( $this, 'clear_dismissals' ) );
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
	 * After admin_init all notification that are not added again should be removed
	 *
	 * We have pages that redirect after adding a notification
	 * which means that we can't have all notifications added to the stack
	 * so they aren't "touched".
	 *
	 * If we remove untouched these will be seen as new, which isn't true.
	 */
	public function enable_remove_untouched() {

		$this->remove_untouched = true;
	}

	/**
	 * Dismiss a notification
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
	 * Check if the user has dismissed a notification
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
	 * Check if the nofitication is being dismissed
	 *
	 * @param string|Yoast_Notification $notification Notification to check dismissal of.
	 * @param string                    $meta_value   Value to set the meta value to if dismissed.
	 *
	 * @return bool True if dismissed.
	 */
	public static function maybe_dismiss_notification( Yoast_Notification $notification, $meta_value = 'seen' ) {

		// Only persistent notifications are dismissible.
		if ( ! $notification->is_persistent() ) {
			return false;
		}

		// If notification is already dismissed, we're done.
		if ( self::is_notification_dismissed( $notification ) ) {
			return true;
		}

		$dismissal_key   = $notification->get_dismissal_key();
		$notification_id = $notification->get_id();

		$is_dismissing = ( $dismissal_key === self::get_user_input( 'notification' ) );
		if ( ! $is_dismissing ) {
			$is_dismissing = ( $notification_id === self::get_user_input( 'notification' ) );
		}

		// Fallback to ?dismissal_key=1&nonce=bla when JavaScript fails.
		if ( ! $is_dismissing ) {
			$is_dismissing = ( '1' === self::get_user_input( $dismissal_key ) );
		}

		if ( ! $is_dismissing ) {
			return false;
		}

		$user_nonce = self::get_user_input( 'nonce' );
		if ( false === wp_verify_nonce( $user_nonce, $notification_id ) ) {
			return false;
		}

		return self::dismiss_notification( $notification, $meta_value );
	}

	/**
	 * Clear dismissal information for the specified Notification
	 *
	 * When a cause is resolved, the next time it is present we want to show
	 * the message again.
	 *
	 * @param string|Yoast_Notification $notification Notification to clear the dismissal of.
	 *
	 * @return bool
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
	 * Clear dismissals of resolved notifications
	 */
	public function clear_dismissals() {

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		$notifications = array_filter(
			$this->notifications,
			array( $this, 'filter_untouched_notifications' )
		);

		$resolved_notifications = array_diff( $this->notifications, $notifications );

		// Remove dismissal so it will be shown next time the condition is met.
		array_map( array( $this, 'clear_dismissal' ), $resolved_notifications );
	}

	/**
	 * Add notification to the cookie
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

			$this->touched[ $notification_id ] = true;

			// If notification ID exists in notifications, don't add again.
			$present_notification = $this->get_notification_by_id( $notification_id );
			if ( ! is_null( $present_notification ) ) {
				$present_notification->refresh_nonce();

				return;
			}

			$this->new[] = $notification_id;
		}

		// Add to list.
		$this->notifications[] = $notification;
	}

	/**
	 * Get the notification by ID
	 *
	 * @param string $notification_id The ID of the notification to search for.
	 *
	 * @return null|Yoast_Notification
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
	 * Display the notifications
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
	 * Remove notification after it has been displayed
	 *
	 * @param Yoast_Notification $notification Notification to remove.
	 */
	private function remove_notification( Yoast_Notification $notification ) {

		$index = array_search( $notification, $this->notifications, true );
		if ( false === $index ) {
			return;
		}

		unset( $this->notifications[ $index ] );
		$this->notifications = array_values( $this->notifications );
	}

	/**
	 * Get the notification count
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
	 * Get the number of notifications not touched this execution
	 *
	 * These notifications have been resolved and should be counted when active again.
	 *
	 * @return int
	 */
	public function get_resolved_notification_count() {

		return ( count( $this->notifications ) - count( $this->touched ) );
	}

	/**
	 * Return the notifications sorted on type and priority
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
	 * AJAX display notifications
	 */
	public function ajax_get_notifications() {

		// Display the notices.
		$this->display_notifications();

		// AJAX die.
		exit;
	}

	/**
	 * Remove storage when the plugin is deactivated
	 */
	public function deactivate_hook() {

		$this->clear_notifications();
	}

	/**
	 * Save persistent notifications to storage
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
	 * Provide a way to verify present notifications
	 *
	 * @return array|Yoast_Notification[] Registered notifications.
	 */
	public function get_notifications() {

		$notifications = $this->notifications;

		if ( ! ( defined( 'DOING_AJAX' ) && DOING_AJAX ) && $this->remove_untouched ) {
			$notifications = array_filter( $notifications, array( $this, 'filter_untouched_notifications' ) );
		}

		return $notifications;
	}

	/**
	 * Get newly added notifications
	 *
	 * @return array
	 */
	public function get_new_notifications() {

		return array_map( array( $this, 'get_notification_by_id' ), $this->new );
	}

	/**
	 * Only get touched notifications
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private function filter_untouched_notifications( Yoast_Notification $notification ) {

		$notification_id = $notification->get_id();

		if ( empty( $notification_id ) ) {
			return true;
		}

		return array_key_exists( $notification_id, $this->touched ) && $this->touched[ $notification_id ];
	}

	/**
	 * Get information from the User input
	 *
	 * @param string $key Key to retrieve.
	 *
	 * @return mixed value of key if set.
	 */
	private static function get_user_input( $key ) {

		$filter_input_type = INPUT_GET;
		if ( 'POST' === filter_input( INPUT_SERVER, 'REQUEST_METHOD' ) ) {
			$filter_input_type = INPUT_POST;
		}

		return filter_input( $filter_input_type, $key );
	}

	/**
	 * Retrieve the notifications from storage
	 *
	 * @return array Yoast_Notification[] Notifications
	 */
	private function retrieve_notifications_from_storage() {

		$stored_notifications = get_user_option( self::STORAGE_KEY, get_current_user_id() );

		// Check if notifications are stored.
		if ( empty( $stored_notifications ) ) {
			return;
		}

		if ( is_array( $stored_notifications ) ) {
			$this->notifications = array_map( array( $this, 'array_to_notification' ), $stored_notifications );
		}
	}

	/**
	 * Sort on type then priority
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
	 * Dismiss the notification
	 *
	 * @param Yoast_Notification $notification Notification to dismiss.
	 * @param string             $meta_value   Value to save in the dismissal.
	 *
	 * @return bool
	 */
	private static function dismiss_notification( Yoast_Notification $notification, $meta_value = 'seen' ) {
		// Dismiss notification.
		return ( false !== update_user_meta( get_current_user_id(), $notification->get_dismissal_key(), $meta_value ) );
	}

	/**
	 * Remove all notifications from storage
	 */
	private function remove_storage() {

		delete_user_option( get_current_user_id(), self::STORAGE_KEY );
	}

	/**
	 * Clear local stored notifications
	 */
	private function clear_notifications() {

		$this->notifications = array();
	}

	/**
	 * Filter out non-persistent notifications.
	 *
	 * @param Yoast_Notification $notification Notification to test for persistent.
	 *
	 * @since 3.2
	 *
	 * @return bool
	 */
	private function filter_persistent_notifications( Yoast_Notification $notification ) {

		return $notification->is_persistent();
	}

	/**
	 * Filter out dismissed notifications
	 *
	 * @param Yoast_Notification $notification Notification to check.
	 *
	 * @return bool
	 */
	private function filter_dismissed_notifications( Yoast_Notification $notification ) {

		return ! $this->maybe_dismiss_notification( $notification );
	}

	/**
	 * Convert Notification to array representation
	 *
	 * @param Yoast_Notification $notification Notification to convert.
	 *
	 * @since 3.2
	 *
	 * @return array
	 */
	private function notification_to_array( Yoast_Notification $notification ) {

		return $notification->to_array();
	}

	/**
	 * Convert stored array to Notification.
	 *
	 * @param array $notification_data Array to convert to Notification.
	 *
	 * @return Yoast_Notification
	 */
	private function array_to_notification( $notification_data ) {

		return new Yoast_Notification(
			$notification_data['message'],
			$notification_data['options']
		);
	}

	/**
	 * Write the notifications to a cookie (hooked on shutdown)
	 *
	 * Function renamed to 'update_storage'.
	 *
	 * @deprecated 3.2 remove in 3.5
	 */
	public function set_transient() {
	}
}
