<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration;

use Brain\Monkey;

/**
 * Tests the File_Failure_Llms_Txt_Notification_Integration maybe_show_notification.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration::maybe_show_notification
 */
final class Maybe_Show_Notification_Test extends Abstract_File_Failure_Llms_Txt_Notification_Integration_Test {

	/**
	 * Tests the maybe_show_notification when there is a failure.
	 *
	 * @return void
	 */
	public function test_maybe_show_notification_option_set_no_notification() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_llms_txt_file_failure', false )
			->andReturn( 'failure' );
		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 1 );
		$this->notification_center->expects( 'get_notification_by_id' )->andReturnFalse();
		$this->notification_center->expects( 'restore_notification' );
		$this->notification_center->expects( 'add_notification' );
		$this->file_failure_notification_presenter->expects( 'present' );
		$this->instance->maybe_show_notification();
	}

	/**
	 * Tests the maybe_show_notification when there is a failure but the notification already exists.
	 *
	 * @return void
	 */
	public function test_maybe_show_notification_option_set_notification_exists() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_llms_txt_file_failure', false )
			->andReturn( 'failure' );
		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 1 );
		$this->notification_center->expects( 'get_notification_by_id' )->andReturnTrue();
		$this->notification_center->expects( 'restore_notification' )->never();
		$this->notification_center->expects( 'add_notification' )->never();

		$this->instance->maybe_show_notification();
	}

	/**
	 * Tests the maybe_show_notification without failure.
	 *
	 * @return void
	 */
	public function test_maybe_show_notification_option_not_set() {
		$this->notification_center->expects( 'remove_notification_by_id' )->with( 'wpseo-llms-txt-generation-failure' );
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_llms_txt_file_failure', false )
			->andReturn( false );
		$this->instance->maybe_show_notification();
	}
}
