<?php
/**
* WPSEO plugin test file.
*
* @package WPSEO\Tests\Admin
*/

/**
* Unit test class.
*/
class WPSEO_Calibration_Beta_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_Calibration_Beta::update_option()
	 */
	public function test_update_option_with_empty_input() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Calibration_Beta' )
			->setMethods( array( 'subscribe_newsletter' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'subscribe_newsletter' );

		$instance->update_option( array(), array() );
	}

	/**
	 * @covers WPSEO_Calibration_Beta::update_option()
	 */
	public function test_update_option_with_option_set_to_true() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Calibration_Beta' )
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
	 * @covers WPSEO_Calibration_Beta::update_option()
	 */
	public function test_update_option_with_option_set_to_false() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Calibration_Beta' )
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
}
