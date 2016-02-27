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
	public static function initialise_notifiers() {
		$instance = self::get();

		$instance->register_notifier( new Yoast_Search_Engine_Visibility_Notifier() );
		$instance->register_notifier( new Yoast_Default_Tagline_Notifier() );
		$instance->register_notifier( new Yoast_Algorithm_Update_Notifier() );

		$instance->register_notifier( new Yoast_API_Libs_Required_Version_Notifier() );
		$instance->register_notifier( new Yoast_GA_Incompatible_Version_Notifier() );
		$instance->register_notifier( new Yoast_GA_Compatibility_Notifier() );

		$instance->register_notifier( new Yoast_Google_Search_Console_Configuration_Notifier() );
	}

	/**
	 * Dismiss a notification
	 */
	public static function ajax_dismiss_notification() {
		$notification_center = self::get();

		$notification_id = filter_input( INPUT_POST, 'notification' );
		$notification    = $notification_center->get_notification( $notification_id );

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
		// Empty dismissal keys can never be set i.e. Non-persistent notifications are always active.
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
	 *
	 * @param string                    $meta_value   Value to set the meta value to if dismissed.
	 *
	 * @return bool
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

		$is_dismissing = ( '1' === self::get_user_input( $notification_id ) || '1' === self::get_user_input( $dismissal_key ) );
		$user_nonce    = self::get_user_input( 'nonce' );

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

		if ( ! isset( $dismissal_key ) ) {
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
		$this->notifications[] = $notification;
	}

	/**
	 * Get the notification by ID
	 *
	 * @param string $notification_id The ID of the notification to search for.
	 *
	 * @return null|Yoast_Notification
	 */
	public function get_notification( $notification_id ) {
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

		$this->notifications = array_unique( $this->notifications );

		// Display notifications.
		if ( count( $this->notifications ) > 0 ) {
			foreach ( $this->notifications as $notification ) {

				if ( $this->show_notification( $notification ) ) {
					echo $notification;
				}
			}
		}

		// Clear the local stored notifications.
		$this->clear_notifications();
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
	 * Register a notifier and apply notification
	 *
	 * @param Yoast_Notifier_Interface $notifier Notifier to add to the stack.
	 */
	public function register_notifier( Yoast_Notifier_Interface $notifier ) {
		// Prevent duplicates.
		if ( $this->has_notifier( $notifier ) ) {
			return;
		}

		$this->add_notifier( $notifier );

		$notification = $notifier->get_notification();
		if ( $notifier->notify() ) {
			$this->add_notification( $notification );

			return;
		}

		// Remove dismissal so it will be shown next time.
		$this->clear_dismissal( $notification );
	}

	/**
	 * Remove transient when the plugin is deactivated
	 */
	public function deactivate_hook() {
		$this->clear_notifications();
	}

	/**
	 * Write the notifications to a cookie (hooked on shutdown)
	 */
	public function set_transient() {

		if ( count( $this->notifications ) === 0 ) {
			$this->clear_storage();

			return;
		}

		// Create array with all notifications.
		$arr_notifications = array();

		// Add each notification as array to $arr_notifications.
		foreach ( $this->notifications as $notification ) {
			$arr_notifications[] = $notification->to_array();
		}

		// Set the cookie with notifications.
		update_option(
			self::STORAGE_KEY,
			WPSEO_Utils::json_encode( $arr_notifications ),
			false
		);
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
	private function add_notifier( Yoast_Notifier_Interface $notifier ) {
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

		// Don't display if the user doesn't have enough capabilities and such.
		if ( ! $notification->display_for_current_user() ) {
			return false;
		}

		return true;
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

			// Create Yoast_Notification objects.
			if ( count( $stored_notifications ) > 0 ) {
				foreach ( $stored_notifications as $notification_data ) {
					$notifications[] = new Yoast_Notification(
						$notification_data['message'],
						$notification_data['options']
					);
				}
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
}
