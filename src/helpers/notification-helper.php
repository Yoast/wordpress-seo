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
}
