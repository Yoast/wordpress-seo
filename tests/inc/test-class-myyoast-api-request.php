<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 *
 * @group MyYoast
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
			->setMethods( array( 'do_request', 'decode_response', 'get_access_token', 'remove_access_token' ) )
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
			'response' => 'okay!',
		);

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->returnValue( wp_json_encode( $response ) ) );

		$this->assertTrue( $instance->fire() );
		$this->assertAttributeEquals( (object) $response, 'response', $instance );
		$this->assertEquals( (object) $response, $instance->get_response() );
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

	/**
	 * Tests the enriching of the request headers.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::enrich_request_arguments
	 */
	public function test_enrich_request_arguments() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request_Double' )
			->setMethods( array( 'get_request_body', 'get_installed_addon_versions' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_request_body' )
			->will(
				$this->returnValue(
					array(
						'This is' => 'the request body',
					)
				)
			);

		$instance
			->expects( $this->once() )
			->method( 'get_installed_addon_versions' )
			->will(
				$this->returnValue(
					array(
						'yoast-seo-wordpress-premium' => '10.0',
					)
				)
			);

		$this->assertEquals(
			array(
				'body'    => array(
					'This is' => 'the request body',
				),
				'headers' => array(
					'yoast-seo-wordpress-premium-version' => '10.0',
				),
			),
			$instance->enrich_request_arguments( array() )
		);
	}

	/**
	 * Tests the enriching of the request headers with empty request body.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::enrich_request_arguments
	 */
	public function test_enrich_request_arguments_with_empty_request_body() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request_Double' )
			->setMethods( array( 'get_request_body', 'get_installed_addon_versions' ) )
			->setConstructorArgs( array( 'endpoint' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_request_body' )
			->will( $this->returnValue( array() ) );

		$instance
			->expects( $this->once() )
			->method( 'get_installed_addon_versions' )
			->will(
				$this->returnValue(
					array(
						'yoast-seo-wordpress-premium' => '10.0',
					)
				)
			);

		$this->assertEquals(
			array(
				'headers' => array(
					'yoast-seo-wordpress-premium-version' => '10.0',
				),
			),
			$instance->enrich_request_arguments( array() )
		);
	}

	/**
	 * Test Exception is being called correctly.
	 *
	 * Unit test to make sure this is fixed: https://github.com/Yoast/wordpress-seo/issues/12560
	 *
	 * @expectedException        WPSEO_MyYoast_Bad_Request_Exception
	 * @expectedExceptionMessage Error
	 */
	public function test_exception_arguments() {
		add_filter( 'pre_http_request', [ $this, 'return_error_object' ] );

		$instance = new WPSEO_MyYoast_Api_Request_Double( 'some_url', array() );
		$instance->do_request( 'some_url', array() );
	}

	public function return_error_object() {
		return new WP_Error( 'error-code', 'Error' );
	}
}
