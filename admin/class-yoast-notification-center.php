<?php
/**
 * @package WPSEO\Admin\Notifications
 */

/**
 * Handles notifications storage and display.
 */
class Yoast_Notification_Center implements Yoast_Notification_Center_Interface {

	const STORAGE_KEY = 'yoast_notifications';

	/**
	 * The singleton instance of this object
	 *
	 * @var \Yoast_Notification_Center
	 */
	public static $instance = null;

	/** @var $notifications Yoast_Notification[] */
	private $notifications = array();

	/** @var array Yoast_Notifier_Interface[] Registered Notifiers */
	private $notifiers = array();

	/**
	 * Construct
	 */
	private function __construct() {

		// Load the notifications from transient.
		$this->notifications = $this->get_notifications_from_storage();

		if ( ! defined( 'DOING_AJAX' ) ) {
			$this->clear_notifications();
		}

		add_action( 'admin_init', array( $this, 'register_notifications' ) );
		add_action( 'all_admin_notices', array( $this, 'display_notifications' ) );
		add_action( 'shutdown', array( $this, 'set_transient' ) );
		add_action( 'wp_ajax_yoast_get_notifications', array( $this, 'ajax_get_notifications' ) );
		add_action( 'wpseo_deactivate', array( $this, 'deactivate_hook' ) );
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
	 * Initialise global notifiers
	 *
	 * Notifiers that are not dependent of a class concretion should be registered here.
	 */
	public static function initialize_notifiers() {
		$instance = self::get();

		/**
		 * Context dependent notifications:
		 * - Yoast_Not_Indexable_Homepage_Notifier - WPSEO_OnPage, needs option information.
		 * - Yoast_Plugin_Conflict_Notifier - Yoast_Plugin_Conflict, needs plugin+conflict information.
		 */

		/**
		 * Action Register Notifiers
		 *
		 * Allow to hook into the notification center notifier registration.
		 *
		 * @param $instance Yoast_Notification_Center Instance to register notifier on.
		 */
		do_action( 'yoast_register_notifiers', $instance );
	}

	/**
	 * Register notifications of notifiers
	 *
	 * This has to happen after the translations have been loaded.
	 */
	public function register_notifications() {
		/** @var Yoast_Notifier_Interface $notifier */
		foreach ( $this->notifiers as $notifier ) {
			$notification = $notifier->get_notification();
			// Make sure we are working with a proper Notification.
			if ( false === ( $notification instanceof Yoast_Notification ) ) {
				continue;
			}

			if ( $notifier->notify() ) {
				$this->add_notification( $notification );
			}
			else {
				// Remove dismissal so it will be shown next time.
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
		$notification    = $notification_center->get_notification_by_id( $notification_id );

		if ( false === ( $notification instanceof Yoast_Notification ) ) {
			die( '-1' );
		}

		if ( $notification_center->maybe_dismiss_notification( $notification ) ) {
			die( '1' );
		}

		die( '-1' );
	}

	/**
	 * Check if the user has dismissed a notification
	 *
	 * @param string   $dismissal_key The dismissal key.
	 * @param null|int $user_id       User ID to check on.
	 *
	 * @return bool
	 */
	public static function is_notification_dismissed( $dismissal_key, $user_id = null ) {
		// Empty dismissal keys can never be set i.e. non-persistent notifications are always active.
		if ( empty( $dismissal_key ) ) {
			return false;
		}

		$user_id = ( ! is_null( $user_id ) ? $user_id : get_current_user_id() );

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
	public static function maybe_dismiss_notification( $notification, $meta_value = 'seen' ) {
		$notification_id = self::get_notification_id( $notification );
		$dismissal_key   = self::get_dismissal_key( $notification );

		if ( false === $notification_id || false === $dismissal_key ) {
			return false;
		}

		// If notification is already dismissed, we're done.
		if ( self::is_notification_dismissed( $dismissal_key ) ) {
			return true;
		}

		$is_dismissing = $dismissal_key === self::get_user_input( 'notification' );
		$is_dismissing = $is_dismissing || ( '1' === self::get_user_input( $notification_id ) );
		$is_dismissing = $is_dismissing || ( '1' === self::get_user_input( $dismissal_key ) );

		$user_nonce = self::get_user_input( 'nonce' );

		// Can be dismissed by dismissal_key or notification_id.
		if ( ! $is_dismissing ) {
			return false;
		}

		if ( false === wp_verify_nonce( $user_nonce, $notification_id ) ) {
			return false;
		}

		// Dismiss notification.
		update_user_meta( get_current_user_id(), $dismissal_key, $meta_value );

		return true;
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
		// Don't add persistent notifications that have already been added.
		$notification_id = $notification->get_id();
		if ( ! empty( $notification_id ) ) {
			$found = $this->get_notification_by_id( $notification->get_id() );
			if ( ! is_null( $found ) ) {
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
		$this->clear_notifications();
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
			$a_priority = $a->get_priority();
			$b_priority = $b->get_priority();

			if ( $a_priority === $b_priority ) {
				return 0;
			}

			return ( ( $a_priority < $b_priority ) ? 1 : - 1 );
		}

		if ( 'error' === $a_type ) {
			return - 1;
		}

		if ( 'error' === $b_type ) {
			return 1;
		}

		return 0;
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
	 * Remove transient when the plugin is deactivated
	 */
	public function deactivate_hook() {
		$this->clear_notifiers();
		$this->clear_notifications();
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
		// Create array with all notifications.
		$notifications = array();

		// Add each notification as array to $arr_notifications.
		foreach ( $this->notifications as $notification ) {
			if ( $notification->is_persistent() ) {
				$notifications[] = $notification->to_array();
			}
		}

		// No notifications to store, clear storage.
		if ( count( $notifications ) === 0 ) {
			$this->clear_storage();

			return;
		}

		// Save the notifications to the storage.
		update_option( self::STORAGE_KEY, WPSEO_Utils::json_encode( $notifications ), false );
	}

	/**
	 * Provide a way to verify registered notifiers
	 *
	 * @return array|Yoast_Notifier_Interface[] Registered notifiers.
	 */
	public 	function get_notifiers() {
		return $this->notifiers;
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
	 * Get Notification Identifier
	 *
	 * @param string|Yoast_Notification $notification Notification to get the ID of.
	 *
	 * @return bool|string Identifier if found, False if not found.
	 */
	private static function get_notification_id( $notification ) {
		if ( $notification instanceof Yoast_Notification ) {
			return $notification->get_id();
		}

		if ( is_string( $notification ) ) {
			return $notification;
		}

		return false;
	}

	/**
	 * Get the dismissal key for the notification
	 *
	 * @param string|Yoast_Notification $notification Notification to get the dismissal key of.
	 *
	 * @return bool|string Dismissal key if found, False if not found.
	 */
	private static function get_dismissal_key( $notification ) {
		if ( $notification instanceof Yoast_Notification ) {
			return $notification->get_dismissal_key();
		}

		if ( is_string( $notification ) ) {
			return $notification;
		}

		return false;
	}

	/**
	 * Keep a list of notifiers so we don't add duplicates
	 *
	 * @param Yoast_Notifier_Interface $notifier Notifier to add to the stack.
	 */
	public function add_notifier( Yoast_Notifier_Interface $notifier ) {
		// Prevent duplicates.
		if ( $this->has_notifier( $notifier ) ) {
			return;
		}

		$this->notifiers[] = $notifier;
	}

	/**
	 * Check if the notifier is already registered
	 *
	 * @param Yoast_Notifier_Interface $notifier Notifier to check for.
	 *
	 * @return bool
	 */
	private function has_notifier( Yoast_Notifier_Interface $notifier ) {
		return in_array( $notifier, $this->notifiers, true );
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

		// The notifications array.
		$notifications = array();

		$stored_notifications = get_option( self::STORAGE_KEY );

		// Check if transient is set.
		if ( false !== $stored_notifications ) {

			// Get json notifications from transient.
			$stored_notifications = json_decode( $stored_notifications, true );
			if ( ! is_array( $stored_notifications ) || empty( $stored_notifications ) ) {
				return $notifications;
			}

			// Create Yoast_Notification objects.
			foreach ( $stored_notifications as $notification_data ) {
				$notifications[] = new Yoast_Notification(
					$notification_data['message'],
					$notification_data['options']
				);
			}
		}

		return $notifications;
	}

	/**
	 * Clear the notifications in storage
	 */
	private function clear_storage() {
		delete_option( self::STORAGE_KEY );
	}

	/**
	 * Clear local stored notifications
	 */
	private function clear_notifications() {
		$this->notifications = array();
	}

	/**
	 * Clear notifiers (mostly for testing)
	 */
	private function clear_notifiers() {
		$this->notifiers = array();
	}
}
