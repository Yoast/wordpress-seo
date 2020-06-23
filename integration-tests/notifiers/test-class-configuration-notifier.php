<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Unit Test Class
 *
 * @group notifiers
 */
class WPSEO_Configuration_Notifier_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether the wizard notification calls the right function for the right notification - in this case the first time notification
	 *
	 * @covers WPSEO_Configuration_Notifier::notify
	 * @covers WPSEO_Configuration_Notifier::first_time_notification
	 */
	public function test_notify_when_not_started_wizard() {
		WPSEO_Options::set( 'show_onboarding_notice', true );
		WPSEO_Options::set( 'started_configuration_wizard', false);

		$instance = $this->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setMethods( [ 'first_time_notification' ] )
			->getMock();

		$instance->expects( $this->once() )->method( 'first_time_notification' );

		$instance->notify();

	}

	/**
	 * Tests whether the wizard notification calls the right function for the right notification - in this case the continue notification
	 *
	 * @covers WPSEO_Configuration_Notifier::notify
	 * @covers WPSEO_Configuration_Notifier::continue_notification
	 */
	public function test_notify_when_started_wizard() {
		WPSEO_Options::set( 'show_onboarding_notice', true );
		WPSEO_Options::set( 'started_configuration_wizard', true);

		$instance = $this->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setMethods( [ 'continue_notification' ] )
			->getMock();

		$instance->expects( $this->once() )->method( 'continue_notification' );

		$instance->notify();

	}

	/**
	 * Tests whether the wizard notification calls the right function for the right notification - in this case the rerun notification
	 *
	 * @covers WPSEO_Configuration_Notifier::notify
	 * @covers WPSEO_Configuration_Notifier::re_run_notification
	 */
	public function test_notify_when_completed_wizard() {
		WPSEO_Options::set( 'show_onboarding_notice', false );

		$instance = $this->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setMethods( [ 're_run_notification' ] )
			->getMock();

		$instance->expects( $this->once() )->method( 're_run_notification' );

		$instance->notify();

	}

	/**
	 * Tests if the get_notification_message function returns the correct value when passed "start".
	 *
	 * @covers Wizard_Notification::get_notification_message
	 * @covers Wizard_Notification::get_start_notification
	 */
	public function test_notification_message_start()
	{
		$notifier = new Wizard_Notification();
		$this->assertEquals('Get started quickly with the configuration wizard!<br/>We have detected that you have not started this wizard yet, so we recommend you to <a href="http://example.org/wp-admin/admin.php?page=wpseo_configurator">start the configuration wizard to configure Yoast SEO</a>.', $notifier->get_notification_message( 'start' ));
	}

	/**
	 * Tests if the get_notification_message function returns the correct value when passed "continue".
	 *
	 * @covers Wizard_Notification::get_notification_message
	 * @covers Wizard_Notification::get_continue_notification
	 */
	public function test_notification_message_continue()
	{
		$notifier = new Wizard_Notification();
		$this->assertEquals('The configuration wizard helps you to easily configure your site to have the optimal SEO settings.<br/>We have detected that you have not finished this wizard yet, so we recommend you to <a href="http://example.org/wp-admin/admin.php?page=wpseo_configurator">start the configuration wizard to configure Yoast SEO</a>.', $notifier->get_notification_message( 'continue' ));
	}

	/**
	 * Tests if the get_notification_message function returns the correct value when passed "finish".
	 *
	 * @covers Wizard_Notification::get_notification_message
	 * @covers Wizard_Notification::get_finished_notification
	 */
	public function test_notification_message_finish()
	{
		$notifier = new Wizard_Notification();
		$this->assertEquals('You have successfully completed the configuration wizard, good job!<br/>If you want to double-check your Yoast SEO settings, or change something, you can always <a href="http://example.org/wp-admin/admin.php?page=wpseo_configurator">reopen the configuration wizard</a>.', $notifier->get_notification_message( 'finish' ));
	}

	/**
	 * Tests if the get_notification_message function returns nothing when passed a empty string.
	 *
	 * @covers Wizard_Notification::get_notification_message
	 */
	public function test_notification_message_empty()
	{
		$notifier = new Wizard_Notification();
		$this->assertEquals('', $notifier->get_notification_message( '' ));
	}
}
