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
	 * @inheritdoc
	 */
	public function dismiss() {
		parent::dismiss();
	}

	/**
	 * @inheritdoc
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
