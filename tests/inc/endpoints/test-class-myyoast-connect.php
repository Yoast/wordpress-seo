<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group MyYoast
 */
class WPSEO_Endpoint_MyYoast_Connect_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests request handling with url mismatch.
	 *
	 * @covers WPSEO_Endpoint_MyYoast_Connect::handle_request
	 */
	public function test_get_handle_request_url_mismatch() {
		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->once() )
			->method( 'get_param' )
			->will( $this->returnValue( 'http://example.org' ) );

		$instance = $this
			->getMockBuilder( 'WPSEO_Endpoint_MyYoast_Connect' )
			->setMethods( array( 'get_home_url' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_home_url' )
			->will( $this->returnValue( 'http://example2.org' ) );

		$this->assertEquals(
			new WP_REST_Response(
				'Bad request: URL mismatch.',
				403
			),
			$instance->handle_request( $request )
		);
	}

	/**
	 * Tests request handling with client id mismatch.
	 *
	 * @covers WPSEO_Endpoint_MyYoast_Connect::handle_request
	 */
	public function test_get_handle_request_client_id_mismatch() {
		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->exactly( 2 ) )
			->method( 'get_param' )
			->will(
				$this->onConsecutiveCalls(
					'http://example.org',
					'123-456-7890'
				)
			);

		$instance = $this
			->getMockBuilder( 'WPSEO_Endpoint_MyYoast_Connect' )
			->setMethods( array( 'get_home_url', 'get_client_id' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_home_url' )
			->will( $this->returnValue( 'http://example.org' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_client_id' )
			->will( $this->returnValue( '098-765-4321' ) );

		$this->assertEquals(
			new WP_REST_Response(
				'Bad request: ClientID mismatch.',
				403
			),
			$instance->handle_request( $request )
		);
	}

	/**
	 * Tests request handling with missing client secret.
	 *
	 * @covers WPSEO_Endpoint_MyYoast_Connect::handle_request
	 */
	public function test_get_handle_request_client_secret_missing() {
		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->exactly( 3 ) )
			->method( 'get_param' )
			->will(
				$this->onConsecutiveCalls(
					'http://example.org',
					'123-456-7890',
					null
				)
			);

		$instance = $this
			->getMockBuilder( 'WPSEO_Endpoint_MyYoast_Connect' )
			->setMethods( array( 'get_home_url', 'get_client_id' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_home_url' )
			->will( $this->returnValue( 'http://example.org' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_client_id' )
			->will( $this->returnValue( '123-456-7890' ) );

		$this->assertEquals(
			new WP_REST_Response(
				'Bad request: ClientSecret missing.',
				403
			),
			$instance->handle_request( $request )
		);
	}

	/**
	 * Tests request handling.
	 *
	 * @covers WPSEO_Endpoint_MyYoast_Connect::handle_request
	 */
	public function test_get_handle_request() {
		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->exactly( 3 ) )
			->method( 'get_param' )
			->will(
				$this->onConsecutiveCalls(
					'http://example.org',
					'123-456-7890',
					'$3cr37'
				)
			);

		$instance = $this
			->getMockBuilder( 'WPSEO_Endpoint_MyYoast_Connect' )
			->setMethods( array( 'get_home_url', 'get_client_id', 'save_secret' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_home_url' )
			->will( $this->returnValue( 'http://example.org' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_client_id' )
			->will( $this->returnValue( '123-456-7890' ) );

		$instance
			->expects( $this->once() )
			->method( 'save_secret' )
			->with( '$3cr37' );

		$this->assertEquals(
			new WP_REST_Response(
				'Connection successful established.'
			),
			$instance->handle_request( $request )
		);
	}

	/**
	 * Tests result of can retrieve data.
	 *
	 * @covers WPSEO_Endpoint_MyYoast_Connect::can_retrieve_data
	 */
	public function test_can_retrieve_data() {
		$instance = new WPSEO_Endpoint_MyYoast_Connect();

		$this->assertTrue( $instance->can_retrieve_data() );
	}
}
