<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Unit Test Class.
 *
 * @group notifiers
 */
class WPSEO_Recalibration_Beta_Notification_Test extends WPSEO_UnitTestCase {

	/**
	 * Handles the notice when not applicable.
	 *
	 * @covers WPSEO_Recalibration_Beta_Notification::handle_notice()
	 */
	public function test_handle_notice_when_not_applicable() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'remove_notification_by_id' ) )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'remove_notification_by_id' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Recalibration_Beta_Notification' )
			->disableOriginalConstructor()
			->setMethods( array( 'get_notification_center' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'get_notification_center' )
			->will( $this->returnValue( $notification_center ) );

		$handler->handle_notice();
	}
}
