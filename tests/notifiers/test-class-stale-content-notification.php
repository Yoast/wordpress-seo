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
class WPSEO_Stale_Content_Notification_Test extends WPSEO_UnitTestCase {

	/**
	 * Handles the notice when applicable.
	 *
	 * @covers WPSEO_Stale_Content_Notification::handle_notice()
	 */
	public function test_handle_notice_when_applicable() {
		$notification = new Yoast_Notification( 'Notification' );

		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'add_notification' )
			->with( $notification );

		$handler = $this
			->getMockBuilder( 'WPSEO_Stale_Content_Notification' )
			->setMethods( array( 'is_applicable', 'get_notification_center', 'get_notification' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->will( $this->returnValue( true ) );

		$handler
			->expects( $this->once() )
			->method( 'get_notification' )
			->will( $this->returnValue( $notification ) );

		$handler
			->expects( $this->once() )
			->method( 'get_notification_center' )
			->will( $this->returnValue( $notification_center ) );

		$handler->handle_notice();
	}

	/**
	 * Handles the notice when not applicable.
	 *
	 * @covers WPSEO_Stale_Content_Notification::handle_notice()
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
			->getMockBuilder( 'WPSEO_Stale_Content_Notification' )
			->setMethods( array( 'is_applicable', 'get_notification_center' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'get_notification_center' )
			->will( $this->returnValue( $notification_center ) );

		$handler->handle_notice();
	}

	/**
	 * Tests is_applicable in some different situations
	 *
	 * @covers WPSEO_Stale_Content_Notification::is_applicable()
	 */
	public function test_is_applicable() {
		$notifier = new WPSEO_Stale_Content_Notification_Double();

		$this->assertTrue( $notifier->is_applicable( true, true ) );
		$this->assertFalse( $notifier->is_applicable( true, false ) );
		$this->assertFalse( $notifier->is_applicable( false, true ) );
		$this->assertFalse( $notifier->is_applicable( false, false ) );
	}

	/**
	 * Tests the notification retrieval when post is enabled.
	 *
	 * @covers WPSEO_Stale_Content_Notification::get_notification_message()
	 */
	public function test_get_notification_message_with_post_enabled() {
		$notifier = new WPSEO_Stale_Content_Notification_Double();

		$this->assertEquals(
			'In this beta, we introduce a stale cornerstone content filter. You can find it <a href="' . admin_url( 'edit.php' ) . '">on the post overview</a>. This functionality is also available for other content types.',
			$notifier->get_notification_message( array( 'post' => 'post' ) )
		);
	}

	/**
	 * Tests the notification retrieval when post is disabled and page is enabled.
	 *
	 * @covers WPSEO_Stale_Content_Notification::get_notification_message()
	 */
	public function test_get_notification_message_with_post_disabled_and_page_enabled() {
		$notifier = new WPSEO_Stale_Content_Notification_Double();

		$this->assertEquals(
			'In this beta, we introduce a stale cornerstone content filter. You can find it <a href="' . admin_url( 'edit.php?post_type=page' ) . '">on the page overview</a>. This functionality is also available for other content types.',
			$notifier->get_notification_message( array( 'page' => 'page' ) )
		);
	}

	/**
	 * Tests the notification retrieval when both post and page are disabled.
	 *
	 * @covers WPSEO_Stale_Content_Notification::get_notification_message()
	 */
	public function test_get_notification_message_with_post_and_page_dishnabled() {
		$notifier = new WPSEO_Stale_Content_Notification_Double();

		$this->assertEquals(
			'In this beta, we introduce a stale cornerstone content filter. You can find it on content type overviews.',
			$notifier->get_notification_message( array() )
		);
	}
}