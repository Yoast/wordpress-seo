<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing the post type archive notification.
 *
 * @deprecated 14.1
 */
class WPSEO_Post_Type_Archive_Notification_Handler extends WPSEO_Dismissible_Notification {

	/**
	 * Defaults for the title option.
	 *
	 * @var array
	 */
	protected $option_defaults = [];

	/**
	 * Sets the notification identifier.
	 *
	 * @deprecated 14.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );
	}

	/**
	 * Returns the notification.
	 *
	 * @deprecated 14.1
	 * @codeCoverageIgnore
	 *
	 * @return Yoast_Notification The notification for the notification center.
	 */
	protected function get_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 14.1' );

		return null;
	}
}
