<?php
/**
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Class Test_Yoast_GA_Incompatible_Version_Notifier
 */
class Test_Yoast_GA_Incompatible_Version_Notifier extends WPSEO_UnitTestCase {

	/**
	 * Get notification should return a Yoast_Notification
	 */
	public function test_get_notification_return_value() {
		$subject = new Yoast_GA_Incompatible_Version_Notifier();

		$this->assertTrue( $subject->get_notification() instanceof Yoast_Notification );
	}

}
