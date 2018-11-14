<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Unit Test Class.
 *
 * @group notifiers
 */
class WPSEO_Calibration_Beta_Notification_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests is_applicable when notices has been dismissed.
	 *
	 * @covers WPSEO_Calibration_Beta_Notification::is_applicable()
	 */
	public function test_is_applicable_notice_dismissed() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Calibration_Beta_Notification_Double' )
			->setMethods( array( 'is_notice_dismissed' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( true ) );

		$this->assertFalse( $handler->is_applicable() );
	}

	/**
	 * Tests is_applicable when beta has been enabled.
	 *
	 * @covers WPSEO_Calibration_Beta_Notification::is_applicable()
	 */
	public function test_is_applicable_with_beta_enabled() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Calibration_Beta_Notification_Double' )
			->setMethods( array( 'is_notice_dismissed', 'is_beta_enabled' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'is_beta_enabled' )
			->will( $this->returnValue( true ) );

		$this->assertFalse( $handler->is_applicable() );
	}

	/**
	 * Tests is_applicable when beta has not been enabled.
	 *
	 * @covers WPSEO_Calibration_Beta_Notification::is_applicable()
	 */
	public function test_is_applicable_without_beta_enabled() {
		$handler = $this
			->getMockBuilder( 'WPSEO_Calibration_Beta_Notification_Double' )
			->setMethods( array( 'is_notice_dismissed', 'is_beta_enabled' ) )
			->getMock();

		$handler
			->expects( $this->once() )
			->method( 'is_notice_dismissed' )
			->will( $this->returnValue( false ) );

		$handler
			->expects( $this->once() )
			->method( 'is_beta_enabled' )
			->will( $this->returnValue( false ) );

		$this->assertTrue( $handler->is_applicable() );
	}
}