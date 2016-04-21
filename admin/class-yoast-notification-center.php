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

	/** @var array Yoast_Notification_Condition_Interface[] Registered Notification Conditions */
	private $notification_conditions = array();

	/**
	 * Construct
	 */
	private function __construct() {

		// Load the notifications from storage.
		$this->notifications = $this->get_notifications_from_storage();

		add_action( 'admin_init', array( $this, 'register_notifications' ) );
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
	 * Initialise global notification conditions
	 *
	 * Conditions that don't have dependencies should be registered here.
	 */
	public static function initialize_conditions() {

		$instance = self::get();

		/**
		 * Context dependent notifications:
		 * - Yoast_Not_Indexable_Homepage_Condition - WPSEO_OnPage, needs option information.
		 * - Yoast_Plugin_Conflict_Condition - Yoast_Plugin_Conflict, needs plugin+conflict information.
		 */

		/**
		 * Action Register Notification Conditionns
		 *
		 * Allow to hook into the notification center conditions registration.
		 *
		 * @param $instance Yoast_Notification_Center Instance to register condition on.
		 */
		do_action( 'yoast_register_notification_conditions', $instance );
	}

	/**
	 * Register notifications of conditions
	 *
	 * This has to happen after the translations have been loaded.
	 */
	public function register_notifications() {

		/** @var Yoast_Notification_Condition $condition */
		foreach ( $this->notification_conditions as $condition ) {
			$notification = $condition->get_notification();

			if ( $condition->is_met() ) {
				$this->add_notification( $notification );
			}
			else {
				// Remove dismissal so it will be shown next time the condition is met.
				$this->clear_dismissal( $notification );
			}
		}
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

			/*
			 * Activate when all legacy notifications have been replaced.
			 *
			 * die();
			 */
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

		// Can be dismissed by dismissal_key or notification_id.
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
	 * Add notification to the cookie
	 *
	 * @param Yoast_Notification $notification Notification object instance.
	 */
	public function add_notification( Yoast_Notification $notification ) {

		$notification_id = $notification->get_id();

		// Empty notifications are always added.
		if ( $notification_id !== '' ) {
			// If notification ID exists in notifications, don't add again.
			if ( null !== $this->get_notification_by_id( $notification_id ) ) {
				return;
			}
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

		foreach ( $this->notifications as $notification ) {
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
			if ( $this->show_notification( $notification ) ) {
				echo $notification;
			}
		}

		// Clear the local stored notifications.
		if ( ! defined( 'DOING_AJAX' ) ) {
			$this->clear_notifications();
		}
	}

	/**
	 * Return the notifications sorted on type and priority
	 *
	 * @return array|Yoast_Notification[] Sorted Notifications
	 */
	public function get_sorted_notifications() {

		$notifications = $this->notifications;
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

		$this->clear_notification_conditions();
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

		$notifications = array_filter( $this->notifications, array( $this, 'filter_persistent_notifications' ) );

		// No notifications to store, clear storage.
		if ( empty( $notifications ) ) {
			$this->remove_storage();

			return;
		}

		$notifications = array_map( array( $this, 'notification_to_array' ), $notifications );

		// Save the notifications to the storage.
		update_option( self::STORAGE_KEY, WPSEO_Utils::json_encode( $notifications ), true );
	}

	/**
	 * Provide a way to verify registered conditions
	 *
	 * @return array|Yoast_Notification_Condition[] Registered conditions.
	 */
	public function get_notification_conditions() {

		return $this->notification_conditions;
	}

	/**
	 * Provide a way to verify present notifications
	 *
	 * @return array|Yoast_Notification[] Registered notifications.
	 */
	public function get_notifications() {

		return $this->notifications;
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
	 * Keep a list of conditions so we don't add duplicates
	 *
	 * @param Yoast_Notification_Condition $condition Condition to add to the stack.
	 */
	public function add_notification_condition( Yoast_Notification_Condition $condition ) {

		// Prevent duplicates.
		if ( $this->has_notification_condition( $condition ) ) {
			return;
		}

		$this->notification_conditions[] = $condition;
	}

	/**
	 * Check if the notification condition is already registered
	 *
	 * @param Yoast_Notification_Condition $condition Condition to check for.
	 *
	 * @return bool
	 */
	private function has_notification_condition( Yoast_Notification_Condition $condition ) {

		return in_array( $condition, $this->notification_conditions, true );
	}

	/**
	 * Check if the notification can be shown for the current user
	 *
	 * @param Yoast_Notification $notification Notification to check.
	 *
	 * @return bool
	 */
	private function show_notification( Yoast_Notification $notification ) {

		// Don't display if it has been dismissed for the current user.
		if ( $this->maybe_dismiss_notification( $notification ) ) {
			return false;
		}

		// Don't display if the user doesn't have enough capabilities.
		return $notification->display_for_current_user();
	}

	/**
	 * Get the notifications from storage
	 *
	 * @return array Yoast_Notification[] Notifcations
	 */
	private function get_notifications_from_storage() {

		$stored_notifications = get_option( self::STORAGE_KEY, '' );

		// Check if notifications are stored.
		if ( ! empty( $stored_notifications ) ) {

			// Get json notifications from storage.
			$stored_notifications = json_decode( $stored_notifications, true );
			if ( is_array( $stored_notifications ) ) {
				return array_map( array( $this, 'array_to_notification' ), $stored_notifications );
			}
		}

		return array();
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
			return bccomp( $b->get_priority(), $a->get_priority() );
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

		delete_option( self::STORAGE_KEY );
	}

	/**
	 * Clear local stored notifications
	 */
	private function clear_notifications() {

		$this->notifications = array();
	}

	/**
	 * Clear notification conditions (mostly for testing)
	 */
	private function clear_notification_conditions() {

		$this->notification_conditions = array();
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
	 * @depreacted 3.2 remove in 3.5
	 */
	public function set_transient() {
	}
}
