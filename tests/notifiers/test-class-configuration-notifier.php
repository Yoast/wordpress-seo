<?php
/**
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Unit Test Class.
 */
class WPSEO_Configuration_Notifier_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the notify method when the Onboarding Wizard notice won't be shown.
	 *
	 * @covers WPSEO_Configuration_Notifier::notify()
	 */
	public function test_notify_when_onboarding_wizard_notice_wont_be_shown() {
		WPSEO_Options::set( 'show_onboarding_notice', false );
		$notifier = new WPSEO_Configuration_Notifier();

		$this->assertEquals( '', $notifier->notify() );
	}

	/**
	 * Tests the notify method when the Onboarding Wizard notice will be shown.
	 *
	 * @covers WPSEO_Configuration_Notifier::notify()
	 */
	public function test_notify_when_onboarding_wizard_notice_will_be_shown() {
		WPSEO_Options::set( 'show_onboarding_notice', true );
		$notifier = new WPSEO_Configuration_Notifier();

		$this->assertNotEquals( '', $notifier->notify() );
	}

	/**
	 * Tests the listen method when the notification will be shown and dismissal trigger is on.
	 *
	 * @covers WPSEO_Configuration_Notifier::listen()
	 */
	public function test_listen_when_notification_will_be_shown_and_dismissal_trigger_is_on() {
		$notifier = $this
			->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setConstructorArgs( array( 'show_onboarding_notice' => true ) )
			->setMethods( array( 'show_notification', 'dismissal_is_triggered', 'set_dismissed' ) )
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
	 * @covers WPSEO_Configuration_Notifier::listen()
	 */
	public function test_listen_when_notification_is_not_shown() {
		$notifier = $this
			->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setConstructorArgs( array( 'show_onboarding_notice' => true ) )
			->setMethods( array( 'show_notification', 'dismissal_is_triggered', 'set_dismissed' ) )
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
	 * @covers WPSEO_Configuration_Notifier::listen()
	 */
	public function test_listen_when_notification_is_show_but_trigger_is_not_on() {
		$notifier = $this
			->getMockBuilder( 'WPSEO_Configuration_Notifier' )
			->setConstructorArgs( array( 'show_onboarding_notice' => true ) )
			->setMethods( array( 'show_notification', 'dismissal_is_triggered', 'set_dismissed' ) )
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
