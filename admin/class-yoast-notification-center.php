<?php

class Yoast_Notification_Center {

	const COOKIE_KEY = 'yoast_notices';

	/**
	 * Get the notifications from cookie
	 *
	 * @return array
	 */
	private static function get_notifications_from_cookie() {

		// The notifications array
		$notifications = array();

		// Check if cookie is set
		if ( isset( $_COOKIE[ self::COOKIE_KEY ] ) ) {

			// Get json notifications from cookie
			$json_notifications = json_decode( $_COOKIE[ self::COOKIE_KEY ], true );

			// Create Yoast_Notification objects
			if ( count( $json_notifications ) > 0 ) {
				foreach ( $json_notifications as $json_notification ) {
					$notifications[] = new Yoast_Notification( $json_notification['message'], $json_notification['type'] );
				}
			}
		}

		return $notifications;
	}

	/**
	 * Display the message
	 */
	public static function display_notices() {

		// Get the messages
		$notifications = self::get_notifications_from_cookie();

		// Display notifications
		if ( count( $notifications ) > 0 ) {
			foreach ( $notifications as $notification ) {
				add_action( 'all_admin_notices', array( $notification, 'output' ) );
			}
		}

		// Remove the cookie
		setcookie( self::COOKIE_KEY, null, -1 );
	}

	/**
	 * Add notification to the cookie
	 *
	 * @param Yoast_Notification $notification
	 */
	public static function add_notice( Yoast_Notification $notification ) {

		// Get the messages
		$notifications = self::get_notifications_from_cookie();

		// Add the message
		$notifications[] = $notification;

		// Create array with all notifications
		$arr_notifications = array();

		// Add each notification as array to $arr_notifications
		foreach($notifications as $notification ) {
			$arr_notifications[] = $notification->to_array();
		}

		// Set the cookie with notifications
		setcookie( self::COOKIE_KEY, json_encode( $arr_notifications ), time() + 60 * 10 );
	}

}