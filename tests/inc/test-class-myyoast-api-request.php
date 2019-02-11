<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 */
class WPSEO_MyYoast_Api_Request_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests firing the request (happy path).
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::get_response
	 */
	public function test_fire() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request', 'decode_response' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->returnValue( 'raw_response' ) );

		$instance
			->expects( $this->once() )
			->method( 'decode_response' )
			->will( $this->returnValue( 'response' ) );

		$this->assertTrue( $instance->fire() );
		$this->assertEquals( 'response', $instance->get_response() );
	}

	/**
	 * Tests firing the request with an exception being thrown.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::get_error_message
	 */
	public function test_fire_with_bad_request_exception_being_thrown() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request', 'decode_response' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->throwException( new WPSEO_MyYoast_Bad_Request_Exception( 'Request went wrong' ) ) );

		$instance
			->expects( $this->never() )
			->method( 'decode_response' );

		$this->assertFalse( $instance->fire() );
		$this->assertAttributeEquals( 'Request went wrong', 'error_message', $instance );
		$this->assertEquals( 'Request went wrong', $instance->get_error_message() );
	}

	/**
	 * Tests firing the request with an exception being thrown.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 */
	public function test_fire_with_authentication_exception_being_thrown() {
		if ( ! WPSEO_Utils::has_access_token_support() ) {
			$this->markTestSkipped( 'Depends on PHP 5.6 functionality.' );
		}

		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request', 'decode_response', 'get_access_token' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->exactly( 2 ) )
			->method( 'do_request' )
			->will(
				$this->onConsecutiveCalls(
				$this->throwException( new WPSEO_MyYoast_Authentication_Exception( 'Authentication failed' ) ),
					'response'
				)
			);

		$instance
			->expects( $this->once() )
			->method( 'decode_response' );

		$instance
			->expects( $this->once() )
			->method( 'get_access_token' );

		$this->assertTrue( $instance->fire() );
	}

	/**
	 * Tests firing the request with an exception being thrown.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 */
	public function test_fire_with_retrieving_new_access_token_result_in_authentication_error() {
		if ( ! WPSEO_Utils::has_access_token_support() ) {
			$this->markTestSkipped( 'Depends on PHP 5.6 functionality.' );
		}

		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request', 'decode_response', 'get_access_token' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->exactly( 2 ) )
			->method( 'do_request' )
			->will(
				$this->onConsecutiveCalls(
					$this->throwException( new WPSEO_MyYoast_Authentication_Exception( 'Authentication failed' ) ),
					$this->throwException( new WPSEO_MyYoast_Authentication_Exception( 'Authentication failed (again)' ) )
				)
			);

		$instance
			->expects( $this->never() )
			->method( 'decode_response' );

		$instance
			->expects( $this->once() )
			->method( 'get_access_token' );

		$this->assertFalse( $instance->fire() );
	}

	/**
	 * Tests firing the request with an exception being thrown.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 */
	public function test_fire_with_retrieving_new_access_token_result_in_bad_request() {
		if ( ! WPSEO_Utils::has_access_token_support() ) {
			$this->markTestSkipped( 'Depends on PHP 5.6 functionality.' );
		}

		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request', 'decode_response', 'get_access_token' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->exactly( 2 ) )
			->method( 'do_request' )
			->will(
				$this->onConsecutiveCalls(
					$this->throwException( new WPSEO_MyYoast_Authentication_Exception( 'Authentication failed' ) ),
					$this->throwException( new WPSEO_MyYoast_Bad_Request_Exception( 'Bad request' ) )
				)
			);

		$instance
			->expects( $this->never() )
			->method( 'decode_response' );

		$instance
			->expects( $this->once() )
			->method( 'get_access_token' );

		$this->assertFalse( $instance->fire() );
	}

	/**
	 * Tests the decoding of the response with valid input.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::decode_response
	 */
	public function test_decode_response() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$response = array(
			'response' => 'okay!'
		);

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->returnValue( wp_json_encode( $response ) ) );

		$this->assertTrue( $instance->fire() );
		$this->assertAttributeEquals( ( object ) $response, 'response', $instance );
		$this->assertEquals( ( object ) $response, $instance->get_response() );
	}

	/**
	 * Tests the decoding of the response with invalid input.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::fire
	 * @covers WPSEO_MyYoast_Api_Request::decode_response
	 */
	public function test_decode_response_wrong_output() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request' )
			->setMethods( array( 'do_request' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->returnValue( 'raw_response' ) );

		$this->assertFalse( $instance->fire() );
		$this->assertAttributeEquals( 'No JSON object was returned.', 'error_message', $instance );
	}
}
