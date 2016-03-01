<?php
/**
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Class Test_Yoast_Google_Search_Console_Configuration_Notifier
 */
class Test_Yoast_Google_Search_Console_Configuration_Notifier extends WPSEO_UnitTestCase {

	/**
	 * Get notification should return a Yoast_Notification
	 */
	public function test_get_notification_return_value() {
		$subject = new Yoast_Google_Search_Console_Configuration_Notifier();

		$this->assertTrue( $subject->get_notification() instanceof Yoast_Notification );
	}

}
