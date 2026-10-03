<?php

namespace Yoast\WP\SEO\Tests\WP\Notifiers;

use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Dismissible_Notification_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast_Notification_Center;

/**
 * Unit Test Class.
 *
 * @group notifiers
 */
final class Dismissible_Notification_Test extends TestCase {

	/**
	 * Tests the listen method when required value is not present in the request URL.
	 *
	 * @covers WPSEO_Dismissible_Notification::listen
	 *
	 * @return void
	 */
	public function test_listen_when_notification_is_not_dismissed() {
		$handler = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'get_listener_value' ] )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'get_listener_value' )
			->willReturn( null );

		$handler->listen();
	}

	/**
	 * Tests the listener when required value is present in requested URL.
	 *
	 * @covers WPSEO_Dismissible_Notification::listen
	 *
	 * @return void
	 */
	public function test_listen_when_notification_will_be_dismissed() {
		$handler = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'get_listener_value', 'dismiss' ] )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'get_listener_value' )
			->willReturn( '' );

		$handler
			->expects( $this->once() )
			->method( 'dismiss' );

		$handler->listen();
	}

	/**
	 * Tests the handler when the situation is applicable for showing it.
	 *
	 * @covers WPSEO_Dismissible_Notification::handle
	 *
	 * @return void
	 */
	public function test_handle_where_situation_is_applicable() {
		$notification_center = $this
			->getMockBuilder( Yoast_Notification_Center::class )
			->disableOriginalConstructor()
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'add_notification' );

		$handler = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'is_applicable' ] )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->willReturn( true );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests the handler when the situation is not applicable for showing it.
	 *
	 * @covers WPSEO_Dismissible_Notification::handle
	 *
	 * @return void
	 */
	public function test_handle_where_situation_is_not_applicable() {
		$notification_center = $this
			->getMockBuilder( Yoast_Notification_Center::class )
			->disableOriginalConstructor()
			->setMethods( [ 'remove_notification_by_id' ] )
			->getMock();

		$notification_center
			->expects( $this->once() )
			->method( 'remove_notification_by_id' );

		$handler = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'is_applicable' ] )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_applicable' )
			->willReturn( false );

		$handler->handle( $notification_center );
	}

	/**
	 * Tests the dismissal method.
	 *
	 * @covers WPSEO_Dismissible_Notification::dismiss
	 *
	 * @return void
	 */
	public function test_dismiss() {
		$handler = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'set_dismissal_state', 'redirect_to_dashboard' ] )
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
	 * @covers WPSEO_Dismissible_Notification::is_applicable
	 *
	 * @return void
	 */
	public function test_is_applicable_with_dismissed_notice() {
		$instance = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'is_notice_dismissed' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->willReturn( true );

		$this->assertFalse( $instance->is_applicable() );
	}

	/**
	 * Tests is_applicable when notices has not been dismissed.
	 *
	 * @covers WPSEO_Dismissible_Notification::is_applicable
	 *
	 * @return void
	 */
	public function test_is_applicable_with_non_dismissed_notice() {
		$instance = $this
			->getMockBuilder( Dismissible_Notification_Double::class )
			->setMethods( [ 'is_notice_dismissed' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->willReturn( false );

		$this->assertTrue( $instance->is_applicable() );
	}
}
