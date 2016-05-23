<?php
/**
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Test_Yoast_Notification_Center
 */
class Yoast_Notification_Center_Test extends WPSEO_UnitTestCase {
	/**
	 * Remove notifications on tearDown
	 */
	public function tearDown() {
		parent::tearDown();

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->deactivate_hook();
	}

	/**
	 * Test instance.
	 */
	public function test_construct() {
		$subject = Yoast_Notification_Center::get();

		$this->assertTrue( $subject instanceof Yoast_Notification_Center );
	}

	/**
	 * Add notification
	 */
	public function test_add_notification() {
		$notification = new Yoast_Notification( 'notification' );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );

		$this->assertEquals( array( $notification ), $subject->get_notifications() );
	}

	/**
	 * Add wrong notification
	 */
	public function test_add_notification_twice() {
		$notification = new Yoast_Notification( 'notification' );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->add_notification( $notification );

		$notifications = $subject->get_notifications();

		$this->assertEquals( 2, count( $notifications ) );
	}

	/**
	 * Add persistent notification twice
	 *
	 * Only one should be in the list.
	 */
	public function test_add_notification_twice_persistent() {
		$notification = new Yoast_Notification( 'notification', array( 'id' => 'id' ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->add_notification( $notification );

		$notifications = $subject->get_notifications();

		$this->assertEquals( 1, count( $notifications ) );
	}

	/**
	 * Test dismissed notification
	 */
	public function test_is_notification_dismissed() {
		$notification_dismissal_key = 'notification_dismissal';
		$notification               = new Yoast_Notification( 'dismiss', array( 'dismissal_key' => $notification_dismissal_key ) );

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );
		update_user_meta( $user_id, $notification_dismissal_key, '1' );

		$subject = Yoast_Notification_Center::get();
		$this->assertTrue( $subject->is_notification_dismissed( $notification ) );
	}

	/**
	 * Clearing dismissal after it was set
	 */
	public function test_clear_dismissal() {
		$notification = new Yoast_Notification( 'notification', array( 'id' => 'id' ) );

		$subject = Yoast_Notification_Center::get();

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		update_user_meta( $user_id, $notification->get_dismissal_key(), '1' );

		$this->assertTrue( $subject->is_notification_dismissed( $notification ) );

		$this->assertTrue( $subject->clear_dismissal( $notification ) );

		$this->assertFalse( $subject->is_notification_dismissed( $notification ) );
	}

	/**
	 * Clearing dismissal after it was set as string
	 */
	public function test_clear_dismissal_as_string() {
		$notification = new Yoast_Notification( 'notification', array( 'id' => 'id' ) );

		$subject = Yoast_Notification_Center::get();

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		update_user_meta( $user_id, $notification->get_dismissal_key(), '1' );

		$this->assertTrue( $subject->is_notification_dismissed( $notification ) );

		$this->assertTrue( $subject->clear_dismissal( $notification->get_dismissal_key() ) );

		$this->assertFalse( $subject->is_notification_dismissed( $notification ) );
	}

	/**
	 * Clear dismissal with empty key
	 */
	public function test_clear_dismissal_empty_key() {
		$subject = Yoast_Notification_Center::get();
		$this->assertFalse( $subject->clear_dismissal( '' ) );
	}

	/**
	 * Saving notifications to storage
	 */
	public function test_update_storage() {

		wp_set_current_user(1);

		$message = 'b';
		$options = array( 'id' => 'id' );

		$notification = new Yoast_Notification(
			$message,
			$options
		);

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );

		$subject->update_storage();

		$stored_notifications = get_user_option( Yoast_Notification_Center::STORAGE_KEY, get_current_user_id() );

		$test = array( $notification->to_array() );

		$this->assertInternalType( 'array', $stored_notifications );
		$this->assertEquals( $test, $stored_notifications );
	}

	/**
	 * Not saving non-persistent notifications to storage
	 */
	public function test_update_storage_non_persistent() {
		$notification = new Yoast_Notification( 'b' );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );

		$subject->update_storage();

		$stored_notifications = get_option( Yoast_Notification_Center::STORAGE_KEY );

		$this->assertFalse( $stored_notifications );
	}

	/**
	 * Sort one notification
	 */
	public function test_get_sorted_notifications() {
		$notification = new Yoast_Notification( 'c' );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );

		$sorted = $subject->get_sorted_notifications();

		$this->assertInternalType( 'array', $sorted );
		$this->assertEquals( array( $notification ), $sorted );
	}

	/**
	 * No notification to sort, still an array
	 */
	public function test_get_sorted_notifications_empty() {
		$subject = Yoast_Notification_Center::get();

		$sorted = $subject->get_sorted_notifications();

		$this->assertInternalType( 'array', $sorted );
		$this->assertEquals( array(), $sorted );
	}

	/**
	 * Sort by type
	 */
	public function test_get_sorted_notifications_by_type() {
		$message_1 = '1';
		$options_1 = array( 'type' => 'update' );

		$message_2 = '2';
		$options_2 = array( 'type' => 'error' );

		$notification_1 = new Yoast_Notification( $message_1, $options_1 );
		$notification_2 = new Yoast_Notification( $message_2, $options_2 );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification_1 );
		$subject->add_notification( $notification_2 );

		$sorted = $subject->get_sorted_notifications();

		$this->assertEquals( array( $notification_2, $notification_1 ), $sorted );
	}

	/**
	 * Sort by priority
	 */
	public function test_get_sorted_notifications_by_priority() {
		$message_1 = '1';
		$options_1 = array( 'type' => 'error', 'priority' => 0.5 );

		$message_2 = '2';
		$options_2 = array( 'type' => 'error', 'priority' => 1 );

		$notification_1 = new Yoast_Notification( $message_1, $options_1 );
		$notification_2 = new Yoast_Notification( $message_2, $options_2 );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification_1 );
		$subject->add_notification( $notification_2 );

		$sorted = $subject->get_sorted_notifications();

		$this->assertEquals( array( $notification_2, $notification_1 ), $sorted );
	}

	/**
	 * Display notification
	 *
	 * @covers Yoast_Notification_Center::display_notifications
	 */
	public function test_display_notifications() {
		$message = 'c';
		$options = array();

		$notification = $this
			->getMockBuilder( 'Yoast_Notification' )
			->setConstructorArgs( array( $message, $options ) )
			->setMethods( array( 'display_for_current_user', '__toString' ) )
			->getMock();

		$notification
			->expects( $this->any() )
			->method( 'display_for_current_user' )
			->will( $this->returnValue( true ) );

		$notification
			->expects( $this->any() )
			->method( '__toString' )
			->will( $this->returnValue( 'a' ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		$this->expectOutput( 'a' );
	}

	/**
	 * Display notification not for current user
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 * @covers Yoast_Notification_Center::display_notifications
	 */
	public function test_display_notifications_not_for_current_user() {
		$message = 'c';
		$options = array();

		$notification = $this
			->getMockBuilder( 'Yoast_Notification' )
			->setConstructorArgs( array( $message, $options ) )
			->setMethods( array( 'display_for_current_user', '__toString' ) )
			->getMock();

		$notification
			->expects( $this->any() )
			->method( 'display_for_current_user' )
			->will( $this->returnValue( false ) );

		$notification
			->expects( $this->any() )
			->method( '__toString' )
			->will( $this->returnValue( 'a' ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		$this->expectOutput( '' );
	}

	/**
	 * Test dismissed notification displaying
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 * @covers Yoast_Notification_Center::display_notifications
	 */
	public function test_display_dismissed_notification() {
		$notification_dismissal_key = 'dismissed';

		$message = 'c';
		$options = array( 'id' => 'my_id', 'dismissal_key' => $notification_dismissal_key );

		$notification = new Yoast_Notification( $message, $options );

		// Dismiss the key for the current user.
		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );
		update_user_meta( $user_id, $notification_dismissal_key, '1' );

		// Add the notification.
		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		// It should not be displayed.
		$this->expectOutput( '' );
	}

	/**
	 * When a notification already exists the list with an outdated nonce it should be updated
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 */
	public function test_update_nonce_on_re_add_notification() {
		// Put outdated notification in storage / notification center list
		$notification_center = Yoast_Notification_Center::get();

		$old_nonce = 'outdated';

		$outdated = new Yoast_Notification( 'outdated', array( 'nonce' => $old_nonce, 'id' => 'test' ) );
		$new = new Yoast_Notification( 'new', array( 'id' => 'test' ) );

		$notification_center->add_notification( $outdated );
		$notification_center->add_notification( $new );

		$notifications = $notification_center->get_notifications();

		$this->assertInternalType( 'array', $notifications );
		$this->assertContainsOnlyInstancesOf( 'Yoast_Notification', $notifications );
		$this->assertNotEquals( $notifications[0]->get_nonce(), $old_nonce );
	}

	/**
	 * Test if the persistent notification is seen as new
	 */
	public function test_notification_is_new() {
		$id = 'my_id';

		$notification_center = Yoast_Notification_Center::get();

		$notification = new Yoast_Notification( 'notification', array( 'id' => $id ) );
		$notification_center->add_notification( $notification );

		$new = $notification_center->get_new_notifications();

		$this->assertInternalType( 'array', $new );
		$this->assertContains( $notification, $new );
	}
}
