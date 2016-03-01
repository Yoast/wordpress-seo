<?php

class Test_Yoast_Notification extends WPSEO_UnitTestCase {
	/**
	 * Tests:
	 *  Set options
	 *  Verify options
	 *  Apply filter 'wpseo_notification_capabilities'
	 *  Apply filter 'wpseo_notification_capability_check'
	 *  Match capabilities
	 *  display_for_current_user
	 *  is_persistent
	 *  get_dismissal_key
	 *  get_priority
	 */

	public function test_not_persistent() {
		$subject = new Yoast_Notification( 'message', array() );
		$this->assertFalse( $subject->is_persistent() );
	}
}
