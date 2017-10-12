<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the notification for the configuration wizard.
 */
class WPSEO_Configuration_Notification {

	const META_NAME  = 'wpseo-dismiss-configuration-notice';
	const META_VALUE = 'yes';

	/**
	 * Sets the dismissal state for notification for the given user.
	 *
	 * @param int $user_id The user id to dismissed the notice for.
	 */
	public static function set_dismissed( $user_id ) {
		update_user_meta( $user_id, self::META_NAME, self::META_VALUE );
	}

	/**
	 * Checks if the user has dismissed the notification.
	 *
	 * @param int $user_id The user id to check for.
	 *
	 * @return bool True when the notification has been dismissed.
	 */
	public static function is_dismissed( $user_id ) {
		return get_user_meta( $user_id, self::META_NAME, true ) === self::META_VALUE;
	}
}
