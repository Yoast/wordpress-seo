<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
use ReflectionProperty;
use RuntimeException;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification;
use Yoast_Notification_Center;
use Yoast_Notifications;

/**
 * Tests the notification restore AJAX handler.
 *
 * @coversDefaultClass Yoast_Notifications
 */
final class Notifications_Test extends TestCase {

	/**
	 * Restores request and singleton state.
	 *
	 * @return void
	 */
	protected function tear_down() {
		unset( $_POST['notification'], $_POST['nonce'] );

		$instance = new ReflectionProperty( Yoast_Notification_Center::class, 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );

		parent::tear_down();
	}

	/**
	 * Tests that an invalid nonce cannot restore a notification.
	 *
	 * @covers ::ajax_restore_notification
	 * @covers ::get_notification_from_ajax_request
	 *
	 * @return void
	 */
	public function test_restore_rejects_invalid_nonce() {
		$this->set_notification();

		Monkey\Functions\expect( 'check_ajax_referer' )
			->once()
			->with( 'notice-id', 'nonce' )
			->andThrow( new RuntimeException( 'Invalid nonce.' ) );
		Monkey\Functions\expect( 'delete_user_option' )->never();
		Monkey\Functions\expect( 'delete_user_meta' )->never();

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Invalid nonce.' );

		( new Yoast_Notifications() )->ajax_restore_notification();
	}

	/**
	 * Tests that a valid nonce restores only the current user's notification.
	 *
	 * @covers ::ajax_restore_notification
	 * @covers ::get_notification_from_ajax_request
	 * @covers ::output_ajax_response
	 * @covers ::get_view_html
	 *
	 * @return void
	 */
	public function test_restore_accepts_valid_nonce() {
		$center = $this->set_notification();
		$center->expects( 'get_sorted_notifications' )->once()->andReturn( [] );
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Monkey\Functions\expect( 'check_ajax_referer' )->once()->with( 'notice-id', 'nonce' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_current_user_id' )->once()->andReturn( 123 );
		Monkey\Functions\expect( 'delete_user_option' )->once()->with( 123, 'notice-dismissal' )->andReturn( true );
		Monkey\Functions\expect( 'metadata_exists' )->once()->with( 'user', 123, 'notice-dismissal' )->andReturn( false );
		Monkey\Functions\expect( 'wp_die' )->once();

		\ob_start();
		( new Yoast_Notifications() )->ajax_restore_notification();
		$response = \json_decode( \ob_get_clean(), true );

		$this->assertSame( 0, $response['total'] );
		$this->assertStringContainsString( 'No new notifications.', $response['html'] );
	}

	/**
	 * Registers a notification for the AJAX request.
	 *
	 * @return Yoast_Notification_Center The notification center mock.
	 */
	private function set_notification() {
		$_POST['notification'] = 'notice-id';

		$notification = Mockery::mock( Yoast_Notification::class );
		$notification->allows( 'get_id' )->andReturn( 'notice-id' );
		$notification->allows( 'get_dismissal_key' )->andReturn( 'notice-dismissal' );
		$notification->allows( 'get_type' )->andReturn( 'warning' );

		$center = Mockery::mock( Yoast_Notification_Center::class )->makePartial();
		$center->expects( 'get_notification_by_id' )->once()->with( 'notice-id' )->andReturn( $notification );

		$instance = new ReflectionProperty( Yoast_Notification_Center::class, 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, $center );

		return $center;
	}
}
