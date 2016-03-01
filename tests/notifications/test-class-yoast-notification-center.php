<?php

class Test_Yoast_Notification_Center extends WPSEO_UnitTestCase {
	/**
	 * Tests:
	 *  Set notifications to storage
	 *  Get notifications from storage
	 *  Clear stored notificatoins
	 *  register_notifications
	 *  ajax_dismiss_notification
	 *  is_notification_dismissed
	 *  maybe_dismiss_notification
	 *      -- extensive arguments
	 *  clear_dismissal
	 *  add_notification
	 *  get_notification_by_id
	 *  display_notifications
	 *
	 * Notification display for user is called
	 * Notifier resolve is called
	 * Notifier notification is added
	 */

	public function test_construct() {
		$subject = Yoast_Notification_Center::get();

		$this->assertTrue( $subject instanceof Yoast_Notification_Center );
	}
}
