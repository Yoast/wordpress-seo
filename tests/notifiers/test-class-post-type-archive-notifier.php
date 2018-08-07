<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Unit Test Class.
 */
class WPSEO_Post_Type_Archive_Notifier_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the listen method when required value is not present in the request url.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::listen
	 */
	public function test_listen_when_notification_is_not_dismissed() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'get_listener_value', 'redirect_to_dashboard' ) )
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
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::listen
	 */
	public function test_listen_when_notification_will_be_dismissed() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'get_listener_value', 'set_dismissal_state', 'redirect_to_dashboard' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'get_listener_value' )
			->will( $this->returnValue( 'post-type-archive-notification' ) );

		$handler
			->expects( $this->once() )
			->method( 'set_dismissal_state' );

		$handler
			->expects( $this->once() )
			->method( 'redirect_to_dashboard' );

		$handler->listen();
	}

	/**
	 * Tests the handler when the situation is applicable for showing it.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::handle()
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
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
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
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::handle()
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
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'is_applicable' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->will( $this->returnValue( false ) );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests is applicable with notification being dismissed.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_for_dismissed_notice() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$notification_center
			->expects( $this->never() )
			->method( 'add_notification' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'is_notice_dismissed' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( true ) );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests is applicable when an installation is new.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_for_new_install() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$notification_center
			->expects( $this->never() )
			->method( 'add_notification' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'is_new_install' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_new_install' )
			->will( $this->returnValue( true ) );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests is applicable when no post types are found.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_when_no_post_types_found() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$notification_center
			->expects( $this->never() )
			->method( 'add_notification' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'get_post_types', 'is_new_install' ) )
			->getMock();

		$handler
			->method( 'is_new_install' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'get_post_types' )
			->will( $this->returnValue( array() ) );

		$handler->handle( $notification_center );
	}

	/**
	 *  Tests is applicable method when there are post types found.
	 *
	 * @covers WPSEO_Post_Type_Archive_Notification_Handler::is_applicable()
	 */
	public function test_is_applicable_when_post_types_found() {
		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'add_notification' );

		$handler = $this
			->getMockBuilder( 'WPSEO_Post_Type_Archive_Notification_Handler' )
			->setMethods( array( 'get_post_types', 'is_new_install' ) )
			->getMock();

		$handler
			->method( 'is_new_install' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->exactly( 2 ) )
			->method( 'get_post_types' )
			->will( $this->returnValue( array( 'post' ) ) );

		$handler->handle( $notification_center );
	}
}
