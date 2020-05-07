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
	 * Tests the listen method when the notification will be shown and dismissal trigger is on.
	 *
	 * @covers WPSEO_Configuration_Notifier::listen
	 */
	public function test_listen_when_notification_will_be_shown_and_dismissal_trigger_is_on() {
		$notifier = $this
			->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setConstructorArgs( [ 'show_onboarding_notice' => true ] )
			->setMethods( [ 'show_notification', 'dismissal_is_triggered', 'set_dismissed' ] )
			->getMock();

		$notifier
			->expects( $this->once() )
			->method( 'show_notification' )
			->will( $this->returnValue( true ) );

		$notifier
			->expects( $this->once() )
			->method( 'dismissal_is_triggered' )
			->will( $this->returnValue( true ) );

		$notifier
			->expects( $this->once() )
			->method( 'set_dismissed' );

		$notifier->listen();
	}

	/**
	 * Tests the listen method when the notification is not shown.
	 *
	 * @covers WPSEO_Configuration_Notifier::listen
	 */
	public function test_listen_when_notification_is_not_shown() {
		$notifier = $this
			->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setConstructorArgs( [ 'show_onboarding_notice' => true ] )
			->setMethods( [ 'show_notification', 'dismissal_is_triggered', 'set_dismissed' ] )
			->getMock();

		$notifier
			->expects( $this->once() )
			->method( 'show_notification' )
			->will( $this->returnValue( false ) );

		$notifier
			->expects( $this->never() )
			->method( 'dismissal_is_triggered' );

		$notifier
			->expects( $this->never() )
			->method( 'set_dismissed' );

		$notifier->listen();
	}

	/**
	 * Tests the listen method when notification is shown, but the dismissed trigger isn't on.
	 *
	 * @covers WPSEO_Configuration_Notifier::listen
	 */
	public function test_listen_when_notification_is_show_but_trigger_is_not_on() {
		$notifier = $this
			->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setConstructorArgs( [ 'show_onboarding_notice' => true ] )
			->setMethods( [ 'show_notification', 'dismissal_is_triggered', 'set_dismissed' ] )
			->getMock();

		$notifier
			->expects( $this->once() )
			->method( 'show_notification' )
			->will( $this->returnValue( true ) );

		$notifier
			->expects( $this->once() )
			->method( 'dismissal_is_triggered' )
			->will( $this->returnValue( false ) );

		$notifier
			->expects( $this->never() )
			->method( 'set_dismissed' );

		$notifier->listen();
	}
}
