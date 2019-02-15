<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 * @group MyYoast
 */
class WPSEO_MyYoast_Route_Test extends WPSEO_UnitTestCase {
	/**
	 * @covers WPSEO_MyYoast_Route::connect()
	 */
	public function test_connect_with_saved_clientId() {
		/** @var WPSEO_MyYoast_Route_Double $instance */
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods( array( 'redirect', 'get_client' ) )
			->getMock();

		/** @var Client $instance */
		$client = $this
			->getMockBuilder( '\Yoast\Tests\Doubles\Oauth\Client' )
			->setMethods( array( 'get_configuration', 'save_configuration' ) )
			->getMock();

		$config_test_data = array(
			'clientId' => "9740f9cf-608e-4327-8a16-24e3ff6a4c0d",
			'secret'   => NULL,
		);

		$instance ->expects( $this->once() )
		          ->method( 'get_client' )
		          ->will( $this->returnValue( $client) );

		$client  ->expects( $this->once() )
		         ->method( 'get_configuration' )
		         ->will( $this->returnValue( $config_test_data) );

		// If the clientId is set no configuration should be saved.
		$client  ->expects( $this->never() )
		         ->method( 'save_configuration' );

		// Regardless of clientId, redirect should be called.
		$instance ->expects( $this->once() )
		          ->method( 'redirect' );

		$instance->connect();
	}
}

