<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * A helper object for notifications.
 */
class Notification_Helper {

	/**
	 * Restores a notification (wrapper function).
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Yoast_Notification $notification The notification to restore.
	 *
	 * @return bool True if restored, false otherwise.
	 */
	public function restore_notification( Yoast_Notification $notification ) {
		return Yoast_Notification_Center::restore_notification( $notification );
	}

	/**
	 * Return the notifications sorted on type and priority. (wrapper function)
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array|Yoast_Notification[] Sorted Notifications
	 */
	public function get_sorted_notifications() {
		$notification_center = Yoast_Notification_Center::get();

		return $notification_center->get_sorted_notifications();
	}

	/**
	 * Check if the user has dismissed a notification. (wrapper function)
	 *
	 * @param Yoast_Notification $notification The notification to check for dismissal.
	 * @param int|null           $user_id      User ID to check on.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	private function is_notification_dismissed( Yoast_Notification $notification, $user_id = null ) {
		return Yoast_Notification_Center::is_notification_dismissed( $notification, $user_id );
	}

	/**
	 * Parses all the notifications to an array with just warnings notifications, and splitting them between dismissed
	 * and active.
	 *
	 * @return array<Yoast_Notification>
	 */
	public function get_notifications(): array {
		$all_notifications       = $this->get_sorted_notifications();
		$notifications           = \array_filter(
			$all_notifications,
			static function ( $notification ) {
				return $notification->get_type() !== 'error';
			}
		);
		$dismissed_notifications = \array_filter(
			$notifications,
			function ( $notification ) {
				return $this->is_notification_dismissed( $notification );
			}
		);
		$active_notifications    = \array_diff( $notifications, $dismissed_notifications );

		return [
			'dismissed' => \array_map(
				static function ( $notification ) {
					return $notification->to_array();
				},
				$dismissed_notifications
			),
			'active'    => \array_map(
				static function ( $notification ) {
					return $notification->to_array();
				},
				$active_notifications
			),
		];
	}

	/**
	 * Parses all the notifications to an array with just error notifications, and splitting them between dismissed and
	 * active.
	 *
	 * @return array<Yoast_Notification>
	 */
	public function get_problems(): array {
		$all_notifications  = $this->get_sorted_notifications();
		$problems           = \array_filter(
			$all_notifications,
			static function ( $notification ) {
				return $notification->get_type() === 'error';
			}
		);
		$dismissed_problems = \array_filter(
			$problems,
			function ( $notification ) {
				return $this->is_notification_dismissed( $notification );
			}
		);
		$active_problems    = \array_diff( $problems, $dismissed_problems );

		return [
			'dismissed' => \array_map(
				static function ( $notification ) {
					return $notification->to_array();
				},
				$dismissed_problems
			),
			'active'    => \array_map(
				static function ( $notification ) {
					return $notification->to_array();
				},
				$active_problems
			),
		];
	}
}
