<?php
/**
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Test_Yoast_Notification_Center
 */
class Test_Yoast_Notification_Center extends WPSEO_UnitTestCase {
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
	 * Registering a condition
	 */
	public function test_register_condition() {

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array() ) )
		                     ->getMock();

		$condition = $this->getMockBuilder( Yoast_Notification_Condition::class )->getMock();
		$condition->method( 'apply' )->will( $this->returnValue( true ) );
		$condition->method( 'get_notification' )->will( $this->returnValue( $notification ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification_condition( $condition );

		$this->assertEquals( array( $condition ), $subject->get_notificationconditions() );
	}

	/**
	 * Registering a condition
	 */
	public function test_register_condition_twice() {

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array() ) )
		                     ->getMock();

		$condition = $this->getMockBuilder( Yoast_Notification_Condition::class )->getMock();
		$condition->method( 'apply' )->will( $this->returnValue( true ) );
		$condition->method( 'get_notification' )->will( $this->returnValue( $notification ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification_condition( $condition );
		$subject->add_notification_condition( $condition );

		$this->assertEquals( array( $condition ), $subject->get_notificationconditions() );
	}

	/**
	 * Clear notification after setting
	 */
	public function test_clear_notifications() {
		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array() ) )
		                     ->getMock();

		$condition = $this->getMockBuilder( Yoast_Notification_Condition::class )->getMock();
		$condition->method( 'apply' )->will( $this->returnValue( true ) );
		$condition->method( 'get_notification' )->will( $this->returnValue( $notification ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification_condition( $condition );

		$subject->deactivate_hook();

		$this->assertEquals( array(), $subject->get_notificationconditions() );
	}

	/**
	 * Add notification
	 */
	public function test_add_notification() {
		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array() ) )
		                     ->getMock();

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );

		$this->assertEquals( array( $notification ), $subject->get_notifications() );
	}

	/**
	 * Add wrong notification
	 */
	public function test_add_notification_twice() {
		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array() ) )
		                     ->getMock();

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
		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array( 'id' => 'id' ) ) )
		                     ->getMock();

		$notification->method( 'get_id' )->will( $this->returnValue( 'id' ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->add_notification( $notification );

		$notifications = $subject->get_notifications();

		$this->assertEquals( 1, count( $notifications ) );
	}

	/**
	 * Test for not set dismissal key.
	 */
	public function test_is_notification_dismissed_non_existent_key() {
		$subject = Yoast_Notification_Center::get();
		$this->assertFalse( $subject->is_notification_dismissed( '' ) );
		$this->assertFalse( $subject->is_notification_dismissed( 'invalid' ) );
	}

	/**
	 * Test dismissed notification
	 */
	public function test_is_notification_dismissed() {
		$notification_dismissal_key = 'notification_dismissal';

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );
		update_user_meta( $user_id, $notification_dismissal_key, '1' );

		$subject = Yoast_Notification_Center::get();
		$this->assertTrue( $subject->is_notification_dismissed( $notification_dismissal_key ) );
	}

	/**
	 * Clearing dismissal after it was set
	 */
	public function test_clear_dismissal() {
		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array( 'id' => 'id' ) ) )
		                     ->getMock();

		$notification->method( 'get_id' )->will( $this->returnValue( 'id' ) );
		$notification->method( 'get_dismissal_key' )->will( $this->returnValue( 'dismissal_key' ) );

		$subject = Yoast_Notification_Center::get();

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		update_user_meta( $user_id, $notification->get_dismissal_key(), '1' );

		$this->assertTrue( $subject->is_notification_dismissed( $notification->get_dismissal_key() ) );

		$this->assertTrue( $subject->clear_dismissal( $notification ) );

		$this->assertFalse( $subject->is_notification_dismissed( $notification->get_dismissal_key() ) );
	}

	/**
	 * Clearing dismissal after it was set as string
	 */
	public function test_clear_dismissal_as_string() {
		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( 'notification', array( 'id' => 'id' ) ) )
		                     ->getMock();

		$notification->method( 'get_id' )->will( $this->returnValue( 'id' ) );
		$notification->method( 'get_dismissal_key' )->will( $this->returnValue( 'dismissal_key' ) );

		$subject = Yoast_Notification_Center::get();

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		update_user_meta( $user_id, $notification->get_dismissal_key(), '1' );

		$this->assertTrue( $subject->is_notification_dismissed( $notification->get_dismissal_key() ) );

		$this->assertTrue( $subject->clear_dismissal( $notification->get_dismissal_key() ) );

		$this->assertFalse( $subject->is_notification_dismissed( $notification->get_dismissal_key() ) );
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
		$message = 'b';
		$options = array( 'id' => 'id' );

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( $message, $options ) )
		                     ->getMock();

		$notification->method( 'get_id' )->will( $this->returnValue( 'id' ) );
		$notification->method( 'is_persistent' )->will( $this->returnValue( true ) );
		$notification->method( 'to_array' )->will(
			$this->returnValue(
				array(
					'message' => $message,
					'options' => $options,
				)
			)
		);

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );

		$subject->update_storage();

		$stored_notifications = get_option( Yoast_Notification_Center::STORAGE_KEY );
		$test                 = WPSEO_Utils::json_encode( array( $notification->to_array() ) );

		$this->assertInternalType( 'string', $stored_notifications );
		$this->assertEquals( $test, $stored_notifications );
	}

	/**
	 * Not saving non-persistant notifications to storage
	 */
	public function test_update_storage_non_persistent() {
		$message = 'b';
		$options = array();

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( $message, $options ) )
		                     ->getMock();

		$notification->method( 'is_persistent' )->will( $this->returnValue( false ) );
		$notification->method( 'to_array' )->will(
			$this->returnValue(
				array(
					'message' => $message,
					'options' => $options,
				)
			)
		);

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
		$message = 'c';
		$options = array();

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( $message, $options ) )
		                     ->getMock();

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

		$notification_1 = $this->getMockBuilder( Yoast_Notification::class )
		                       ->setConstructorArgs( array( $message_1, $options_1 ) )
		                       ->getMock();

		$notification_1->method( 'get_type' )->will( $this->returnValue( 'update' ) );

		$notification_2 = $this->getMockBuilder( Yoast_Notification::class )
		                       ->setConstructorArgs( array( $message_2, $options_2 ) )
		                       ->getMock();

		$notification_2->method( 'get_type' )->will( $this->returnValue( 'error' ) );

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

		$notification_1 = $this->getMockBuilder( Yoast_Notification::class )
		                       ->setConstructorArgs( array( $message_1, $options_1 ) )
		                       ->getMock();

		$notification_1->method( 'get_type' )->will( $this->returnValue( 'error' ) );
		$notification_1->method( 'get_priority' )->will( $this->returnValue( 0.5 ) );

		$notification_2 = $this->getMockBuilder( Yoast_Notification::class )
		                       ->setConstructorArgs( array( $message_2, $options_2 ) )
		                       ->getMock();

		$notification_2->method( 'get_type' )->will( $this->returnValue( 'error' ) );
		$notification_2->method( 'get_priority' )->will( $this->returnValue( 1 ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification_1 );
		$subject->add_notification( $notification_2 );

		$sorted = $subject->get_sorted_notifications();

		$this->assertEquals( array( $notification_2, $notification_1 ), $sorted );
	}

	/**
	 * Display notification
	 */
	public function test_display_notifications() {
		$message = 'c';
		$options = array();

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( $message, $options ) )
		                     ->getMock();

		$notification->method( 'display_for_current_user' )->will( $this->returnValue( true ) );
		$notification->method( '__toString' )->will( $this->returnValue( 'a' ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		$this->expectOutput( 'a' );
	}

	/**
	 * Display notification not for current user
	 */
	public function test_display_notifications_not_for_current_user() {
		$message = 'c';
		$options = array();

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( $message, $options ) )
		                     ->getMock();

		$notification->method( 'display_for_current_user' )->will( $this->returnValue( false ) );
		$notification->method( '__toString' )->will( $this->returnValue( 'a' ) );

		$subject = Yoast_Notification_Center::get();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		$this->expectOutput( '' );
	}

	/**
	 * Test dismissed notification displaying
	 */
	public function test_display_dismissed_notification() {
		$notification_dismissal_key = 'dismissed';

		$message = 'c';
		$options = array( 'dismissal_key' => $notification_dismissal_key );

		$notification = $this->getMockBuilder( Yoast_Notification::class )
		                     ->setConstructorArgs( array( $message, $options ) )
		                     ->getMock();

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
	 * Maybe dismissing
	 */
	public function test_maybe_dismiss_notification() {
		$this->assertFalse( Yoast_Notification_Center::maybe_dismiss_notification( false ) );
		$this->assertFalse( Yoast_Notification_Center::maybe_dismiss_notification( new StdClass() ) );
		$this->assertFalse( Yoast_Notification_Center::maybe_dismiss_notification( '' ) );
		$this->assertFalse( Yoast_Notification_Center::maybe_dismiss_notification( 'maybe' ) );
	}

	/**
	 * Test dismissed notification maybe dismiss
	 */
	public function test_maybe_dismiss_notification_dismissed() {
		$notification_dismissal_key = 'notification_dismissal';

		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );
		update_user_meta( $user_id, $notification_dismissal_key, '1' );

		$this->assertTrue( Yoast_Notification_Center::maybe_dismiss_notification( $notification_dismissal_key ) );
	}
}
