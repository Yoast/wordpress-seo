<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Test_Yoast_Notification_Center.
 *
 * @coversDefaultClass Yoast_Notification_Center
 */
class Yoast_Notification_Center_Test extends WPSEO_UnitTestCase {

	/**
	 * User ID.
	 *
	 * @var int
	 */
	private $user_id;

	/**
	 * Default notification arguments to set up a fake Yoast_Notification.
	 *
	 * @var array
	 */
	private $fake_notification_defaults = [
		'id'            => 'some_id',
		'dismissal_key' => 'notification_dismissal',
	];

	/**
	 * Create user with proper caps.
	 */
	public function set_up() {
		parent::set_up();

		$this->user_id = $this->factory->user->create();

		$user = new WP_User( $this->user_id );
		$user->add_cap( 'wpseo_manage_options' );

		wp_set_current_user( $this->user_id );
	}

	/**
	 * Remove notifications on tearDown.
	 */
	public function tear_down() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->deactivate_hook();

		parent::tear_down();
	}

	/**
	 * Test instance.
	 *
	 * @covers ::get
	 */
	public function test_construct() {
		$subject = Yoast_Notification_Center::get();

		$this->assertInstanceOf( Yoast_Notification_Center::class, $subject );
	}

	/**
	 * Add notification.
	 *
	 * @covers ::add_notification
	 */
	public function test_add_notification() {
		$notification = new Yoast_Notification( 'notification' );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );

		$this->assertEquals( [ $notification ], $subject->get_notifications() );
	}

	/**
	 * Add wrong notification.
	 *
	 * @covers ::add_notification
	 */
	public function test_add_notification_twice() {
		$notification = new Yoast_Notification( 'notification' );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );
		$subject->add_notification( $notification );

		$notifications = $subject->get_notifications();

		$this->assertCount( 2, $notifications );
	}

	/**
	 * Add persistent notification twice.
	 *
	 * Only one should be in the list.
	 *
	 * @covers ::add_notification
	 */
	public function test_add_notification_twice_persistent() {
		$notification = new Yoast_Notification( 'notification', [ 'id' => 'some_id' ] );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );
		$subject->add_notification( $notification );

		$notifications = $subject->get_notifications();

		$this->assertCount( 1, $notifications );
	}

	/**
	 * Test dismissed notification.
	 *
	 * @covers ::is_notification_dismissed
	 */
	public function test_is_notification_dismissed() {
		$notification_dismissal_key = 'notification_dismissal';
		$notification               = new Yoast_Notification( 'dismiss', [ 'dismissal_key' => $notification_dismissal_key ] );

		update_user_meta( $this->user_id, $notification_dismissal_key, '1' );

		$subject = $this->get_notification_center();
		$this->assertTrue( $subject->is_notification_dismissed( $notification ) );
	}

	/**
	 * Clearing dismissal after it was set.
	 *
	 * @covers ::clear_dismissal
	 */
	public function test_clear_dismissal() {
		$notification = new Yoast_Notification( 'notification', [ 'id' => 'some_id' ] );

		$subject = $this->get_notification_center();

		update_user_meta( $this->user_id, $notification->get_dismissal_key(), '1' );

		$this->assertTrue( $subject->is_notification_dismissed( $notification ) );

		$this->assertTrue( $subject->clear_dismissal( $notification ) );

		$this->assertFalse( $subject->is_notification_dismissed( $notification ) );
	}

	/**
	 * Clearing dismissal after it was set as string.
	 *
	 * @covers ::clear_dismissal
	 */
	public function test_clear_dismissal_as_string() {
		$notification = new Yoast_Notification( 'notification', [ 'id' => 'some_id' ] );

		$subject = $this->get_notification_center();

		update_user_meta( $this->user_id, $notification->get_dismissal_key(), '1' );

		$this->assertTrue( $subject->is_notification_dismissed( $notification ) );

		$this->assertTrue( $subject->clear_dismissal( $notification->get_dismissal_key() ) );

		$this->assertFalse( $subject->is_notification_dismissed( $notification ) );
	}

	/**
	 * Clear dismissal with empty key.
	 *
	 * @covers ::clear_dismissal
	 */
	public function test_clear_dismissal_empty_key() {
		$subject = $this->get_notification_center();
		$this->assertFalse( $subject->clear_dismissal( '' ) );
	}

	/**
	 * Saving notifications to storage.
	 *
	 * @covers ::update_storage
	 */
	public function test_update_storage() {

		$message = 'b';
		$options = [ 'id' => 'some_id' ];

		$notification = new Yoast_Notification(
			$message,
			$options
		);

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );

		$subject->update_storage();

		$stored_notifications = get_user_option( Yoast_Notification_Center::STORAGE_KEY, $this->user_id );

		$test = [ $notification->to_array() ];

		$this->assertIsArray( $stored_notifications );
		$this->assertEquals( $test, $stored_notifications );
	}

	/**
	 * Not saving non-persistent notifications to storage.
	 *
	 * @covers ::update_storage
	 */
	public function test_update_storage_non_persistent() {
		$notification = new Yoast_Notification( 'b' );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );

		$subject->update_storage();

		$stored_notifications = get_option( Yoast_Notification_Center::STORAGE_KEY );

		$this->assertFalse( $stored_notifications );
	}

	/**
	 * Not removing notifications from storage when there are no notifications.
	 *
	 * @covers ::has_stored_notifications
	 * @covers ::remove_storage
	 */
	public function test_remove_storage_without_notifications() {
		$subject = new Yoast_Notification_Center_Double();

		// The notification center does not remove anything when there are no notifications.
		$this->assertFalse( $subject->has_stored_notifications() );

		$this->assertFalse( $subject->remove_storage() );
	}

	/**
	 * Removing notifications from storage when there are notifications.
	 *
	 * @covers ::has_stored_notifications
	 * @covers ::remove_storage
	 */
	public function test_remove_storage_with_notifications() {
		$notification = new Yoast_Notification( 'b', [ 'id' => 'fake_id' ] );

		$subject = new Yoast_Notification_Center_Double();
		$subject->setup_current_notifications();

		$subject->add_notification( $notification );
		$subject->update_storage();

		$this->assertTrue( $subject->has_stored_notifications() );

		$this->assertTrue( $subject->remove_storage() );
	}

	/**
	 * Sort one notification.
	 *
	 * @covers ::get_sorted_notifications
	 */
	public function test_get_sorted_notifications() {
		$notification = new Yoast_Notification( 'c' );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );

		$sorted = $subject->get_sorted_notifications();

		$this->assertIsArray( $sorted );
		$this->assertEquals( [ $notification ], $sorted );
	}

	/**
	 * No notification to sort, still an array.
	 *
	 * @covers ::get_sorted_notifications
	 */
	public function test_get_sorted_notifications_empty() {
		$subject = $this->get_notification_center();

		$sorted = $subject->get_sorted_notifications();

		$this->assertIsArray( $sorted );
		$this->assertEquals( [], $sorted );
	}

	/**
	 * Sort by type.
	 *
	 * @covers ::get_sorted_notifications
	 */
	public function test_get_sorted_notifications_by_type() {
		$message_1 = '1';
		$options_1 = [ 'type' => 'update' ];

		$message_2 = '2';
		$options_2 = [ 'type' => 'error' ];

		$notification_1 = new Yoast_Notification( $message_1, $options_1 );
		$notification_2 = new Yoast_Notification( $message_2, $options_2 );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification_1 );
		$subject->add_notification( $notification_2 );

		$sorted = $subject->get_sorted_notifications();

		$this->assertEquals( [ $notification_2, $notification_1 ], $sorted );
	}

	/**
	 * Sort by priority.
	 *
	 * @covers ::get_sorted_notifications
	 */
	public function test_get_sorted_notifications_by_priority() {
		$message_1 = '1';
		$options_1 = [
			'type'     => 'error',
			'priority' => 0.5,
		];

		$message_2 = '2';
		$options_2 = [
			'type'     => 'error',
			'priority' => 1,
		];

		$notification_1 = new Yoast_Notification( $message_1, $options_1 );
		$notification_2 = new Yoast_Notification( $message_2, $options_2 );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification_1 );
		$subject->add_notification( $notification_2 );

		$sorted = $subject->get_sorted_notifications();

		$this->assertEquals( [ $notification_2, $notification_1 ], $sorted );
	}

	/**
	 * Display notification.
	 *
	 * @covers Yoast_Notification_Center::display_notifications
	 */
	public function test_display_notifications() {
		$message = 'c';
		$options = [];

		$notification = $this
			->getMockBuilder( 'Yoast_Notification' )
			->setConstructorArgs( [ $message, $options ] )
			->setMethods( [ 'display_for_current_user', '__toString' ] )
			->getMock();

		$notification
			->method( 'display_for_current_user' )
			->willReturn( true );

		$notification
			->expects( $this->any() )
			->method( '__toString' )
			->willReturn( 'a' );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		$this->expectOutputString( 'a' );
	}

	/**
	 * Display notification not for current user.
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 * @covers Yoast_Notification_Center::display_notifications
	 */
	public function test_display_notifications_not_for_current_user() {
		$message = 'c';
		$options = [];

		$notification = $this
			->getMockBuilder( 'Yoast_Notification' )
			->setConstructorArgs( [ $message, $options ] )
			->setMethods( [ 'display_for_current_user', '__toString' ] )
			->getMock();

		$notification
			->expects( $this->any() )
			->method( 'display_for_current_user' )
			->willReturn( false );

		$notification
			->expects( $this->any() )
			->method( '__toString' )
			->willReturn( 'a' );

		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		$this->expectOutputString( '' );
	}

	/**
	 * Test dismissed notification displaying.
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 * @covers Yoast_Notification_Center::display_notifications
	 */
	public function test_display_dismissed_notification() {
		$notification_dismissal_key = 'dismissed';

		$message = 'c';
		$options = [
			'id'            => 'my_id',
			'dismissal_key' => $notification_dismissal_key,
		];

		$notification = new Yoast_Notification( $message, $options );

		// Dismiss the key for the current user.
		update_user_meta( $this->user_id, $notification_dismissal_key, '1' );

		// Add the notification.
		$subject = $this->get_notification_center();
		$subject->add_notification( $notification );
		$subject->display_notifications();

		// It should not be displayed.
		$this->expectOutputString( '' );
	}

	/**
	 * When a notification already exists the list with an outdated nonce it should be updated.
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 */
	public function test_update_nonce_on_re_add_notification() {
		// Put outdated notification in storage / notification center list.
		$notification_center = $this->get_notification_center();

		$old_nonce = 'outdated';

		$outdated = new Yoast_Notification(
			'outdated',
			[
				'nonce' => $old_nonce,
				'id'    => 'test',
			]
		);
		$new      = new Yoast_Notification( 'new', [ 'id' => 'test' ] );

		$notification_center->add_notification( $outdated );
		$notification_center->add_notification( $new );

		$notifications = $notification_center->get_notifications();

		$this->assertIsArray( $notifications );

		$notification = array_shift( $notifications );

		$this->assertNotEquals( $notification->get_nonce(), $old_nonce );
	}

	/**
	 * Test if the persistent notification is seen as new.
	 *
	 * @covers Yoast_Notification_Center::get_new_notifications
	 */
	public function test_notification_is_new() {
		$id = 'my_id';

		$notification_center = $this->get_notification_center();

		$notification = new Yoast_Notification( 'notification', [ 'id' => $id ] );
		$notification_center->add_notification( $notification );

		$new = $notification_center->get_new_notifications();

		$this->assertIsArray( $new );
		$this->assertContains( $notification, $new );
	}

	/**
	 * Test how many resolved notifications we have.
	 *
	 * @covers Yoast_Notification_Center::get_resolved_notification_count
	 */
	public function test_resolved_notifications() {

		$notification_center = $this->get_notification_center();
		$count               = $notification_center->get_resolved_notification_count();

		// Apply max for static test problems.
		$this->assertEquals( 0, max( 0, $count ) );
	}

	/**
	 * Tests if the notification is not being dismissed.
	 *
	 * @covers Yoast_Notification_Center::maybe_dismiss_notification
	 */
	public function test_maybe_dismiss_notification() {
		$a = new Yoast_Notification( 'a' );
		$this->assertFalse( Yoast_Notification_Center::maybe_dismiss_notification( $a ) );

		$b = new Yoast_Notification( 'b', [ 'id' => uniqid( 'id', true ) ] );
		$this->assertFalse( Yoast_Notification_Center::maybe_dismiss_notification( $b ) );
	}

	/**
	 * Test notification count.
	 *
	 * @covers Yoast_Notification_Center::get_notification_count
	 */
	public function test_get_notification_count() {

		$notification_center = $this->get_notification_center();

		$this->assertEquals( 0, $notification_center->get_notification_count() );

		$notification_center->add_notification( new Yoast_Notification( 'a', [ 'id' => 'some_id' ] ) );

		$this->assertEquals( 1, $notification_center->get_notification_count() );
		$this->assertEquals( 1, $notification_center->get_notification_count( true ) );
	}

	/**
	 * Tests that dismissing a notification only affects the current site in multisite.
	 *
	 * @group ms-required
	 *
	 * @covers Yoast_Notification_Center::dismiss_notification
	 */
	public function test_dismiss_notification_is_per_site() {
		$this->skipWithoutMultisite();

		$site2 = self::factory()->blog->create();

		$notification  = new Yoast_Notification( 'notification', $this->fake_notification_defaults );
		$dismissal_key = $notification->get_dismissal_key();

		// Dismiss notification for the current site.
		Yoast_Notification_Center::dismiss_notification( $notification );

		$site1_dismissed = (bool) get_user_option( $dismissal_key, $this->user_id );

		switch_to_blog( $site2 );
		$site2_dismissed = (bool) get_user_option( $dismissal_key, $this->user_id );
		restore_current_blog();

		$this->assertTrue( $site1_dismissed );
		$this->assertFalse( $site2_dismissed );
	}

	/**
	 * Tests that restoring a notification only affects the current site in multisite.
	 *
	 * @group ms-required
	 *
	 * @covers Yoast_Notification_Center::restore_notification
	 */
	public function test_restore_notification_is_per_site() {
		$this->skipWithoutMultisite();

		$site2 = self::factory()->blog->create();

		$notification  = new Yoast_Notification( 'notification', $this->fake_notification_defaults );
		$dismissal_key = $notification->get_dismissal_key();

		// Dismiss notification for both sites.
		update_user_option( $this->user_id, $dismissal_key, 'seen' );
		switch_to_blog( $site2 );
		update_user_option( $this->user_id, $dismissal_key, 'seen' );
		restore_current_blog();

		// Restore notification for the current site.
		Yoast_Notification_Center::restore_notification( $notification );

		$site1_dismissed = (bool) get_user_option( $dismissal_key, $this->user_id );

		switch_to_blog( $site2 );
		$site2_dismissed = (bool) get_user_option( $dismissal_key, $this->user_id );
		restore_current_blog();

		$this->assertFalse( $site1_dismissed );
		$this->assertTrue( $site2_dismissed );
	}

	/**
	 * Tests that checking for dismissed notifications applies only to the current site in multisite.
	 *
	 * @group ms-required
	 *
	 * @covers Yoast_Notification_Center::is_notification_dismissed
	 */
	public function test_is_notification_dismissed_is_per_site() {
		$this->skipWithoutMultisite();

		if ( version_compare( $GLOBALS['wp_version'], '5.1', '>=' ) ) {
			$this->markTestSkipped( 'Skipped because since WordPress 5.1 the hook wpmu_new_blog is deprecated' );

			return;
		}

		$site2 = self::factory()->blog->create();

		$notification  = new Yoast_Notification( 'notification', $this->fake_notification_defaults );
		$dismissal_key = $notification->get_dismissal_key();

		// Dismiss notification for the current site.
		update_user_option( $this->user_id, $dismissal_key, 'seen' );

		$site1_dismissed = Yoast_Notification_Center::is_notification_dismissed( $notification );

		switch_to_blog( $site2 );
		$site2_dismissed = Yoast_Notification_Center::is_notification_dismissed( $notification );
		restore_current_blog();

		$this->assertTrue( $site1_dismissed );
		$this->assertFalse( $site2_dismissed );
	}

	/**
	 * Tests that checking for dismissed notifications falls back to user meta if no user options.
	 *
	 * @covers Yoast_Notification_Center::is_notification_dismissed
	 */
	public function test_is_notification_dismissed_falls_back_to_user_meta() {

		$notification  = new Yoast_Notification( 'notification', $this->fake_notification_defaults );
		$dismissal_key = $notification->get_dismissal_key();

		// Dismiss notification in the old incorrect way.
		update_user_meta( $this->user_id, $dismissal_key, 'seen' );

		$dismissed = Yoast_Notification_Center::is_notification_dismissed( $notification );

		$this->assertTrue( $dismissed );

		// Ensure the old user metadata has been migrated on-the-fly.
		$this->assertSame( 'seen', get_user_option( $dismissal_key, $this->user_id ) );
		$this->assertEmpty( get_user_meta( $this->user_id, $dismissal_key, true ) );
	}

	/**
	 * Tests that restoring a notification also clears old user metadata.
	 *
	 * @covers Yoast_Notification_Center::restore_notification
	 */
	public function test_restore_notification_clears_user_meta() {

		$notification  = new Yoast_Notification( 'notification', $this->fake_notification_defaults );
		$dismissal_key = $notification->get_dismissal_key();

		// Set notification dismissed in both user option and old user meta way.
		update_user_option( $this->user_id, $dismissal_key, 'seen' );
		update_user_meta( $this->user_id, $dismissal_key, 'seen' );

		$this->assertTrue( Yoast_Notification_Center::restore_notification( $notification ) );
	}

	/**
	 * Tests that nonces are stripped when notifications are fetched from the database.
	 *
	 * @covers Yoast_Notification_Center::retrieve_notifications_from_storage
	 */
	public function test_retrieve_notifications_from_storage_strips_nonces() {
		$notification_center = Yoast_Notification_Center::get();

		$storage_data         = [];
		$expected             = [];
		$sample_notifications = $this->get_sample_notifications();
		foreach ( $sample_notifications as $sample_notification ) {

			// Ensure nonces are present.
			$sample_notification->get_nonce();

			$storage_data[] = $sample_notification->to_array();

			$expected[ $sample_notification->get_id() ] = null;
		}

		update_user_option( get_current_user_id(), Yoast_Notification_Center::STORAGE_KEY, $storage_data );

		$notification_center->setup_current_notifications();

		$stored_notifications = $notification_center->get_notifications();
		foreach ( $stored_notifications as $index => $stored_notification ) {
			$stored_notifications[ $index ] = $stored_notification->to_array();
		}

		$this->assertSame( $expected, wp_list_pluck( wp_list_pluck( $stored_notifications, 'options' ), 'nonce', 'id' ) );
	}

	/**
	 * Tests that nonces are not stored in the database when persisting notifications.
	 *
	 * @covers Yoast_Notification_Center::update_storage
	 */
	public function test_update_storage_strips_nonces() {
		$notification_center = Yoast_Notification_Center::get();

		add_filter( 'yoast_notifications_before_storage', [ $this, 'get_sample_notifications' ] );
		$notification_center->update_storage();

		$stored_notifications = get_user_option( Yoast_Notification_Center::STORAGE_KEY, get_current_user_id() );

		$expected             = [];
		$sample_notifications = $this->get_sample_notifications();
		foreach ( $sample_notifications as $sample_notification ) {
			$expected[ $sample_notification->get_id() ] = null;
		}

		$this->assertSame( $expected, wp_list_pluck( wp_list_pluck( $stored_notifications, 'options' ), 'nonce', 'id' ) );
	}

	/**
	 * Tests removal of a notification when there isn't any with given ID.
	 *
	 * @covers Yoast_Notification_Center::remove_notification_by_id
	 */
	public function test_remove_notification_by_id_when_no_notification_is_found() {

		$this->expect_reflection_deprecation_warning_php74();

		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( [ 'remove_notification' ] )
			->getMock();

		$notification_center
			->expects( $this->never() )
			->method( 'remove_notification' );

		$notification_center->remove_notification_by_id( 'this-id-does-not-exists' );
	}

	/**
	 * Tests removal of a notification.
	 *
	 * @covers Yoast_Notification_Center::remove_notification_by_id
	 */
	public function test_remove_notification_by_id_when_notification_is_found() {

		$this->expect_reflection_deprecation_warning_php74();

		$notification_center = $this
			->getMockBuilder( 'Yoast_Notification_Center' )
			->disableOriginalConstructor()
			->setMethods( [ 'remove_notification', 'get_notification_by_id' ] )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'remove_notification' );

		$notification_center
			->expects( $this->once() )
			->method( 'get_notification_by_id' )
			->willReturn(
				new Yoast_Notification( 'message', [ 'id' => 'this-id-exists' ] )
			);

		$notification_center->remove_notification_by_id( 'this-id-exists' );
	}

	/**
	 * Tests some scenarios for the has_stored_notifications method.
	 *
	 * @dataProvider has_stored_notifications_provider
	 *
	 * @covers Yoast_Notification_Center::has_stored_notifications
	 *
	 * @param mixed  $stored_notifications The return value of get_stored_notifications.
	 * @param bool   $expected             The expected value: true or false.
	 * @param string $message              Message to show when test fails.
	 */
	public function test_has_stored_notifications( $stored_notifications, $expected, $message ) {
		$instance = $this
			->getMockBuilder( 'Yoast_Notification_Center_Double' )
			->setMethods( [ 'get_stored_notifications' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_stored_notifications' )
			->willReturn( $stored_notifications );

		$this->assertEquals( $expected, $instance->has_stored_notifications(), $message );
	}

	/**
	 * A notification can be added twice, if it is added for different users.
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 */
	public function test_add_notifications_for_multiple_users() {

		$instance = $this->get_notification_center();

		$user_mock_1 = $this->mock_wp_user( 1, [ 'wpseo_manage_options' => true ] );
		$user_mock_2 = $this->mock_wp_user( 2, [ 'wpseo_manage_options' => true ] );

		$notification_for_user_1 = new Yoast_Notification(
			'Hello, user 1!',
			[
				'user'         => $user_mock_1,
				'capabilities' => [ 'wpseo_manage_options' ],
			]
		);

		$notification_for_user_2 = new Yoast_Notification(
			'Hello, user 2!',
			[
				'user'         => $user_mock_2,
				'capabilities' => [ 'wpseo_manage_options' ],
			]
		);

		$instance->add_notification( $notification_for_user_1 );
		$instance->add_notification( $notification_for_user_2 );

		$expected_for_user_1 = [ $notification_for_user_1 ];
		$actual_for_user_1   = $instance->get_notifications_for_user( 1 );

		$expected_for_user_2 = [ $notification_for_user_2 ];
		$actual_for_user_2   = $instance->get_notifications_for_user( 2 );

		$this->assertEquals( $expected_for_user_1, $actual_for_user_1 );
		$this->assertEquals( $expected_for_user_2, $actual_for_user_2 );
	}

	/**
	 * A notification with the same ID should only be added once for a single user.
	 *
	 * @covers Yoast_Notification_Center::add_notification
	 */
	public function test_add_notifications_only_once_for_user() {

		$instance = $this->get_notification_center();

		$user_mock = $this->mock_wp_user( 3, [ 'wpseo_manage_options' => true ] );

		$notification = new Yoast_Notification(
			'Hello, user 3!',
			[
				'id'           => 'Yoast_Notification_Test',
				'user'         => $user_mock,
				'capabilities' => [ 'wpseo_manage_options' ],
			]
		);

		$instance->add_notification( $notification );
		$instance->add_notification( $notification );

		$expected = [ $notification ];
		$actual   = $instance->get_notifications_for_user( 3 );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Gets some notification objects.
	 *
	 * This method is used as a filter to override notifications.
	 *
	 * @return array List of notification objects.
	 */
	public function get_sample_notifications() {
		return [
			new Yoast_Notification(
				'notification',
				[ 'id' => 'some_id' ]
			),
			new Yoast_Notification(
				'notification',
				[ 'id' => 'another_id' ]
			),
		];
	}

	/**
	 * Values for the has stored notifications test.
	 *
	 * @return array The test values.
	 */
	public function has_stored_notifications_provider() {
		return [
			[
				'stored_notifications' => false,
				'expected'             => false,
				'message'              => 'With get_stored_notifications returning false',
			],
			[
				'stored_notifications' => [],
				'expected'             => false,
				'message'              => 'With get_stored_notifications returning an empty array',
			],
			[
				'stored_notifications' => [ 'This is a notification' ],
				'expected'             => true,
				'message'              => 'With get_stored_notifications returning a notification',
			],
		];
	}

	/**
	 * Gets the initialized notification center.
	 *
	 * @return Yoast_Notification_Center Notification center instance.
	 */
	private function get_notification_center() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->setup_current_notifications();

		return $notification_center;
	}

	/**
	 * Creates a mock WordPress user.
	 *
	 * @param int   $user_id The ID of the user.
	 * @param array $caps    A map, mapping capabilities to `true` (user has capability) or `false` ( user has not).
	 *
	 * @return PHPUnit_Framework_MockObject_Invocation_Object | WP_User
	 */
	private function mock_wp_user( $user_id, $caps ) {
		$user_mock = $this
			->getMockBuilder( 'WP_User' )
			->setMethods( [ 'has_cap' ] )
			->getMock();

		$user_mock
			->expects( $this->any() )
			->method( 'has_cap' )
			->with( $this->isType( 'string' ) )
			->willReturn(
				$this->returnCallback(
					static function( $argument ) use ( $caps ) {
						return isset( $caps[ $argument ] ) ? $caps[ $argument ] : false;
					}
				)
			);

		$user_mock->ID = $user_id;

		return $user_mock;
	}
}
