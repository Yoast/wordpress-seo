<?php
/**
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Class Test_Yoast_Not_Indexable_Homepage_Notifier
 */
class Test_Yoast_Not_Indexable_Homepage_Notifier extends WPSEO_UnitTestCase {

	/**
	 * Get notification should return a Yoast_Notification
	 */
	public function test_get_notification_return_value() {
		$wpseo_onpage = new WPSEO_OnPage();
		$subject      = new Yoast_Not_Indexable_Homepage_Notifier( $wpseo_onpage );

		$this->assertTrue( $subject->get_notification() instanceof Yoast_Notification );
	}

}
