<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Dismissible_Notification_Double extends WPSEO_Dismissible_Notification {

	/**
	 * Test double. Listens to an argument in the request URL and triggers an action.
	 *
	 * @return void
	 */
	public function dismiss() {
		parent::dismiss();
	}

	/**
	 * Test double. Checks if a notice is applicable.
	 *
	 * @return bool Whether a notice should be shown or not.
	 */
	public function is_applicable() {
		return parent::is_applicable();
	}

	/**
	 * Retrieves instance of a notification.
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function get_notification() {
		return new Yoast_Notification( 'message' );
	}
}
