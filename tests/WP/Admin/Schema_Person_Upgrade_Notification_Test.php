<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use WPSEO_Options;
use WPSEO_Schema_Person_Upgrade_Notification;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Person Schema notification tests.
 *
 * @group Person_Schema
 */
final class Schema_Person_Upgrade_Notification_Test extends TestCase {

	/**
	 * Remove the notification when Person is not selected.
	 *
	 * @covers WPSEO_Schema_Person_Upgrade_Notification::handle_notification
	 *
	 * @return void
	 */
	public function test_remove_notification_not_person() {
		$instance = $this->getMockBuilder( WPSEO_Schema_Person_Upgrade_Notification::class )
			->setMethods( [ 'remove_notification' ] )
			->getMock();

		WPSEO_Options::set( 'company_or_person', 'company' );

		$instance->expects( $this->once() )->method( 'remove_notification' );

		$instance->handle_notification();
	}

	/**
	 * Remove the notification if a person is selected.
	 *
	 * @covers WPSEO_Schema_Person_Upgrade_Notification::handle_notification
	 *
	 * @return void
	 */
	public function test_remove_notification_user_id_set() {
		$instance = $this->getMockBuilder( WPSEO_Schema_Person_Upgrade_Notification::class )
			->setMethods( [ 'remove_notification' ] )
			->getMock();

		WPSEO_Options::set( 'company_or_person', 'person' );
		WPSEO_Options::set( 'company_or_person_user_id', '1' );

		$instance->expects( $this->once() )->method( 'remove_notification' );

		$instance->handle_notification();
	}

	/**
	 * Add a notification when Person is selected, but no person is selected.
	 *
	 * @covers WPSEO_Schema_Person_Upgrade_Notification::handle_notification
	 *
	 * @return void
	 */
	public function test_add_notification() {
		$instance = $this->getMockBuilder( WPSEO_Schema_Person_Upgrade_Notification::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		WPSEO_Options::set( 'company_or_person', 'person' );
		WPSEO_Options::set( 'company_or_person_user_id', '' );

		$instance->expects( $this->once() )->method( 'add_notification' );

		$instance->handle_notification();
	}
}
