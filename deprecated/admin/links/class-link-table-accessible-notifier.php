<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the notice when the table is not accessible.
 */
class WPSEO_Link_Table_Accessible_Notifier {

	/**
	 * Adds the notification to the notification center.
	 *
	 * @deprecated 14.1
	 *
	 * @codeCoverageIgnore
	 */
	public function add_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );
	}

	/**
	 * Removes the notification from the notification center.
	 *
	 * @deprecated 14.1
	 *
	 * @codeCoverageIgnore
	 */
	public function remove_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );
	}

	/**
	 * Returns the notification when the table is not accessible.
	 *
	 * @deprecated 14.1
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function get_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );

		return null;
	}
}
