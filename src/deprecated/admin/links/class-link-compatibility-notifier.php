<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents compatibility with php version 5.3.
 */
class WPSEO_Link_Compatibility_Notifier {

	/**
	 * Adds the notification to the notification center.
	 *
	 * @deprecated 13.1
	 *
	 * @codeCoverageIgnore
	 */
	public function add_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 13.1' );
	}

	/**
	 * Removes the notification from the notification center.
	 *
	 * @deprecated 13.1
	 *
	 * @codeCoverageIgnore
	 */
	public function remove_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 13.1' );
	}

	/**
	 * Returns the notification when the version is incompatible.
	 *
	 * @deprecated 13.1
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Yoast_Notification|null The notification.
	 */
	protected function get_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 13.1' );

		return null;
	}
}
