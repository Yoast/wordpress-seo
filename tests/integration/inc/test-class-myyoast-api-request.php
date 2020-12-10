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
			->setMethods( [ 'do_request', 'decode_response' ] )
			->setConstructorArgs( [ 'endpoint' ] )
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
			->setMethods( [ 'do_request', 'decode_response' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->throwException( new WPSEO_MyYoast_Bad_Request_Exception( 'Request went wrong' ) ) );

		$instance
			->expects( $this->never() )
			->method( 'decode_response' );

		$this->assertFalse( $instance->fire() );
		$this->assertEquals( 'Request went wrong', $this->getPropertyValue( $instance, 'error_message' ) );
		$this->assertEquals( 'Request went wrong', $instance->get_error_message() );
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
			->setMethods( [ 'do_request' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$response = [
			'response' => 'okay!',
		];

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->returnValue( WPSEO_Utils::format_json_encode( $response ) ) );

		$this->assertTrue( $instance->fire() );
		$this->assertEquals( (object) $response, $this->getPropertyValue( $instance, 'response' ) );
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
			->setMethods( [ 'do_request' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'do_request' )
			->will( $this->returnValue( 'raw_response' ) );

		$this->assertFalse( $instance->fire() );
		$this->assertEquals( 'No JSON object was returned.', $this->getPropertyValue( $instance, 'error_message' ) );
	}

	/**
	 * Tests the enriching of the request headers.
	 *
	 * @covers WPSEO_MyYoast_Api_Request::enrich_request_arguments
	 */
	public function test_enrich_request_arguments() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Api_Request_Double' )
			->setMethods( [ 'get_request_body', 'get_installed_addon_versions' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_request_body' )
			->will(
				$this->returnValue(
					[
						'This is' => 'the request body',
					]
				)
			);

		$instance
			->expects( $this->once() )
			->method( 'get_installed_addon_versions' )
			->will(
				$this->returnValue(
					[
						'yoast-seo-wordpress-premium' => '10.0',
					]
				)
			);

		$this->assertEquals(
			[
				'body'    => [
					'This is' => 'the request body',
				],
				'headers' => [
					'yoast-seo-wordpress-premium-version' => '10.0',
				],
			],
			$instance->enrich_request_arguments( [] )
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
			->setMethods( [ 'get_request_body', 'get_installed_addon_versions' ] )
			->setConstructorArgs( [ 'endpoint' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_request_body' )
			->will( $this->returnValue( [] ) );

		$instance
			->expects( $this->once() )
			->method( 'get_installed_addon_versions' )
			->will(
				$this->returnValue(
					[
						'yoast-seo-wordpress-premium' => '10.0',
					]
				)
			);

		$this->assertEquals(
			[
				'headers' => [
					'yoast-seo-wordpress-premium-version' => '10.0',
				],
			],
			$instance->enrich_request_arguments( [] )
		);
	}

	/**
	 * Test Exception is being called correctly.
	 *
	 * Unit test to make sure this is fixed: https://github.com/Yoast/wordpress-seo/issues/12560
	 *
	 * @covers WPSEO_MyYoast_Api_Request::do_request
	 */
	public function test_exception_arguments() {
		$this->expectException( WPSEO_MyYoast_Bad_Request_Exception::class );
		$this->expectExceptionMessage( 'Error' );

		add_filter( 'pre_http_request', [ $this, 'return_error_object' ] );

		$instance = new WPSEO_MyYoast_Api_Request_Double( 'some_url', [] );
		$instance->do_request( 'some_url', [] );

		remove_filter( 'pre_http_request', [ $this, 'return_error_object' ] );
	}

	/**
	 * Helper function for the `test_exception_arguments` test
	 *
	 * @return WP_Error
	 */
	public function return_error_object() {
		return new WP_Error( 'error-code', 'Error' );
	}
}
