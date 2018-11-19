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
class WPSEO_Dismissible_Notification_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the listen method when required value is not present in the request url.
	 *
	 * @covers WPSEO_Dismissible_Notification::listen
	 */
	public function test_listen_when_notification_is_not_dismissed() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'get_listener_value' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'get_listener_value' )
			->will( $this->returnValue( null ) );

		$handler->listen();
	}

	/**
	 * Tests the listener when required value is present in requested url.
	 *
	 * @covers WPSEO_Dismissible_Notification::listen
	 */
	public function test_listen_when_notification_will_be_dismissed() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'get_listener_value', 'dismiss' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'get_listener_value' )
			->will( $this->returnValue( '' ) );

		$handler
			->expects( $this->once() )
			->method( 'dismiss' );

		$handler->listen();
	}

	/**
	 * Tests the handler when the situation is applicable for showing it.
	 *
	 * @covers WPSEO_Dismissible_Notification::handle()
	 */
	public function test_handle_where_situation_is_applicable() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'add_notification' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'is_applicable' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->will( $this->returnValue( true ) );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests the handler when the situation is not applicable for showing it.
	 *
	 * @covers WPSEO_Dismissible_Notification::handle()
	 */
	public function test_handle_where_situation_is_not_applicable() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'remove_notification_by_id' ) )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'remove_notification_by_id' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'is_applicable' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->will( $this->returnValue( false ) );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests the dismissal method.
	 *
	 * @covers WPSEO_Dismissible_Notification::dismiss()
	 */
	public function test_dismiss() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'set_dismissal_state', 'redirect_to_dashboard' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'set_dismissal_state' );

		$handler
			->expects( $this->once() )
			->method( 'redirect_to_dashboard' );

		$handler->dismiss();
	}

	/**
	 * Tests is_applicable when notices has been dismissed.
	 *
	 * @covers WPSEO_Dismissible_Notification::is_applicable()
	 */
	public function test_is_applicable_with_dismissed_notice() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'is_notice_dismissed' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( true ) );

		$this->assertFalse( $instance->is_applicable() );
	}

	/**
	 * Tests is_applicable when notices has not been dismissed.
	 *
	 * @covers WPSEO_Dismissible_Notification::is_applicable()
	 */
	public function test_is_applicable_with_non_dismissed_notice() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Dismissible_Notification_Double' )
			->setMethods( array( 'is_notice_dismissed' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( false ) );

		$this->assertTrue( $instance->is_applicable() );
	}
}
