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
	 * @var WPSEO_Indexable_Service_Double
	 */
	protected $service;

	/**
	 * Sets an instance of the provider.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->service = new WPSEO_Indexable_Service_Double();
	}

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
			->expects( $this->exactly( 2 ) )
			->method( 'get_param' )
			->will( $this->onConsecutiveCalls( 'foo', 100 ) );

		$response = $this->service->get_indexable( $request );

		$this->assertEquals( new WP_REST_Response( 'Invalid type for parameter `provider` passed. Expected `callable`, but got `string`', 500 ), $response );
	}

	/**
	 * Tests the get_indexable for a valid post type and a non indexable.
	 *
	 * @covers WPSEO_Indexable_Service::get_indexable()
	 */
	public function test_get_indexable_for_valid_post_type_with_a_non_indexable_object() {
		$provider = $this
			->getMockBuilder( 'WPSEO_Indexable_Foo_Provider' )
			->setMethods( array( 'get' ) )
			->getMock();

		$provider
			->expects( $this->once() )
			->method( 'get' )
			->will( $this->returnValue( array() ) );

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

		$this->assertEquals( new WP_REST_Response( array(), 200 ), $response );
	}

	/**
	 * Tests the get_indexable for a valid post type and an indexable object.
	 *
	 * @covers WPSEO_Indexable_Service::get_indexable()
	 */
	public function test_get_indexable_for_valid_post_type_with_an_indexable_object() {
		$provider = $this
			->getMockBuilder( 'WPSEO_Indexable_Foo_Provider' )
			->setMethods( array('get' ) )
			->getMock();

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
	 * @expectedException WPSEO_Invalid_Argument_Exception
	 * @covers WPSEO_Indexable_Service::get_provider()
	 */
	public function test_get_provider() {
		$this->assertInstanceOf( 'WPSEO_Indexable_Service_Post_Provider', $this->service->get_provider( 'post' ) );
		$this->assertInstanceOf( 'WPSEO_Indexable_Service_Term_Provider', $this->service->get_provider( 'term' ) );
		$this->service->get_provider( 'foo' );
	}

	/**
	 * Tests the handling of an unknown object type.
	 *
	 * @covers WPSEO_Indexable_Service::handle_unknown_object_type()
	 */
	public function test_handle_unknown_object_type() {
		$this->assertInstanceOf( 'WP_REST_Response', $this->service->handle_unknown_object_type( 'unknown' ) );
	}
}
