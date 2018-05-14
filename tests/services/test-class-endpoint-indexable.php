<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group indexable
 */
class WPSEO_Indexable_Service_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the get_indexable for an invalid post type.
	 *
	 * @covers WPSEO_Indexable_Service::get_indexable()
	 */
	public function test_get_indexable_for_invalid_object_type() {
		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->once() )
			->method( 'get_param' )
			->will( $this->returnValue( 'foo' ) );

		$service  = new WPSEO_Indexable_Service();
		$response = $service->get_indexable( $request );

		$this->assertEquals( new WP_REST_Response( 'Unknown type foo', 400 ), $response );
	}

	/**
	 * Tests the get_indexable for a valid post type and a non indexable.
	 *
	 * @covers WPSEO_Indexable_Service::get_indexable()
	 */
	public function test_get_indexable_for_valid_post_type_with_a_non_indexable_object() {
		$provider = $this
			->getMockBuilder( 'WPSEO_Indexable_Foo_Provider' )
			->setMethods( array( 'is_indexable' ) )
			->getMock();

		$provider
			->expects( $this->once() )
			->method( 'is_indexable' )
			->will( $this->returnValue( false ) );

		$service = $this
			->getMockBuilder( 'WPSEO_Indexable_Service' )
			->setMethods( array( 'get_provider' ) )
			->getMock();

		$service
			->expects( $this->once() )
			->method( 'get_provider' )
			->will( $this->returnValue( $provider ) );

		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->exactly( 2 ) )
			->method( 'get_param' )
			->will( $this->onConsecutiveCalls( 'foo', 100 ) );

		/**
		 * Represents the indexable service object.
		 *
		 * @var WPSEO_Indexable_Service $service The service object.
		 */
		$response = $service->get_indexable( $request );

		$this->assertEquals( new WP_REST_Response( 'Object foo with id 100 not found', 404 ), $response );
	}

	/**
	 * Tests the get_indexable for a valid post type and an indexable object.
	 *
	 * @covers WPSEO_Indexable_Service::get_indexable()
	 */
	public function test_get_indexable_for_valid_post_type_with_an_indexable_object() {
		$provider = $this
			->getMockBuilder( 'WPSEO_Indexable_Foo_Provider' )
			->setMethods( array( 'is_indexable', 'get' ) )
			->getMock();

		$provider
			->expects( $this->once() )
			->method( 'is_indexable' )
			->will( $this->returnValue( true ) );

		$provider
			->expects( $this->once() )
			->method( 'get' )
			->will( $this->returnValue( 'This is the return value of the get method' ) );


		$service = $this
			->getMockBuilder( 'WPSEO_Indexable_Service' )
			->setMethods( array( 'get_provider' ) )
			->getMock();

		$service
			->expects( $this->once() )
			->method( 'get_provider' )
			->will( $this->returnValue( $provider ) );

		$request = $this
			->getMockBuilder( 'WP_REST_Request' )
			->setMethods( array( 'get_param' ) )
			->getMock();

		$request
			->expects( $this->exactly( 2 ) )
			->method( 'get_param' )
			->will( $this->onConsecutiveCalls( 'foo', 100 ) );

		/**
		 * Represents the indexable service object.
		 *
		 * @var WPSEO_Indexable_Service $service The service object.
		 */
		$response = $service->get_indexable( $request );

		$this->assertEquals( new WP_REST_Response( 'This is the return value of the get method' ), $response );
	}

	/**
	 * Tests the return value of the get_provider.
	 *
	 * @covers WPSEO_Indexable_Service::get_provider()
	 */
	public function test_get_provider() {
		$service = new WPSEO_Indexable_Service_Double();

		$this->assertInstanceOf( 'WPSEO_Indexable_Service_Post_Provider', $service->get_provider( 'post' ) );
		$this->assertInstanceOf( 'WPSEO_Indexable_Service_Term_Provider', $service->get_provider( 'term' ) );
		$this->assertNull( $service->get_provider( 'foo' ) );
	}
}
