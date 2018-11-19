<?php
/**
* WPSEO plugin test file.
*
* @package WPSEO\Tests\Admin
*/

/**
* Unit test class.
*/
class WPSEO_Recalibration_Beta_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_Recalibration_Beta::update_option()
	 */
	public function test_update_option_with_empty_input() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Recalibration_Beta' )
			->setMethods( array( 'subscribe_newsletter' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'subscribe_newsletter' );

		$instance->update_option( array(), array() );
	}

	/**
	 * @covers WPSEO_Recalibration_Beta::update_option()
	 */
	public function test_update_option_with_option_set_to_true() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Recalibration_Beta' )
			->setMethods( array( 'subscribe_newsletter' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'subscribe_newsletter' );

		$instance->update_option(
			array(
				'recalibration_beta' => false,
			),
			array(
				'recalibration_beta' => true,
			)
		);
	}

	/**
	 * @covers WPSEO_Recalibration_Beta::update_option()
	 */
	public function test_update_option_with_option_set_to_false() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Recalibration_Beta' )
			->setMethods( array( 'subscribe_newsletter' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'subscribe_newsletter' );

		$instance->update_option(
			array(
				'recalibration_beta' => true,
			),
			array(
				'recalibration_beta' => false,
			)
		);
	}

	/**
	 * Tests the subscribe method when already has been subscribed.
	 *
	 * @covers WPSEO_Recalibration_Beta::subscribe_newsletter()
	 */
	public function test_subscribe_newsletter_when_already_subscribed() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Recalibration_Beta_Double' )
			->setMethods( array( 'has_mailinglist_subscription' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'has_mailinglist_subscription' )
			->will( $this->returnValue( true ) );

		$instance->subscribe_newsletter();
	}

	/**
	 * Test subscribing to the newsletter when there isn't an earlier subscription.
	 *
	 * @covers WPSEO_Recalibration_Beta::subscribe_newsletter()
	 */
	public function test_subscribe_newsletter() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Recalibration_Beta_Double' )
			->setMethods( array( 'has_mailinglist_subscription', 'do_request', 'set_mailinglist_subscription' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'has_mailinglist_subscription' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->once() )
			->method( 'do_request' );

		$instance
			->expects( $this->once() )
			->method( 'set_mailinglist_subscription' );

		$instance->subscribe_newsletter();
	}
	/**
	 * Tests retrieval of the option value with any given value.
	 *
	 * @covers WPSEO_Recalibration_Beta::get_option_value()
	 */
	public function test_get_option_value() {
		$instance = new WPSEO_Recalibration_Beta_Double();

		$this->assertEquals( 'on', $instance->get_option_value( true ) );
		$this->assertEquals( 'off', $instance->get_option_value( false ) );
		$this->assertEquals( 'off', $instance->get_option_value( 'any other value' ) );
		$this->assertEquals( 'off', $instance->get_option_value( null ) );
		$this->assertEquals( 'off', $instance->get_option_value( array() ) );
	}
}
