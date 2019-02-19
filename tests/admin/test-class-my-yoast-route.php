<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 *
 * @group MyYoast
 */
class WPSEO_MyYoast_Route_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests registrations of the hooks without being on the yoast route.
	 *
	 * @covers WPSEO_MyYoast_Route::register_hooks
	 */
	public function test_register_hooks_on_no_yoast_route() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'is_myyoast_route' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_myyoast_route' )
			->will( $this->returnValue( false ) );

		$instance->register_hooks();

		$this->assertFalse( has_action( 'admin_menu', array( $instance, 'register_route' ) ) );
		$this->assertFalse( has_action( 'admin_init', array( $instance, 'handle_route' ) ) );
	}

	/**
	 * Tests registrations of the hooks without having enough rights.
	 *
	 * @covers WPSEO_MyYoast_Route::register_hooks
	 */
	public function test_register_hooks_cannot_access_route() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'is_myyoast_route', 'can_access_route' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_myyoast_route' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'can_access_route' )
			->will( $this->returnValue( false ) );

		$instance->register_hooks();

		$this->assertFalse( has_action( 'admin_menu', array( $instance, 'register_route' ) ) );
		$this->assertFalse( has_action( 'admin_init', array( $instance, 'handle_route' ) ) );
	}

	/**
	 * Tests registrations of the hooks with having an invalid route action.
	 *
	 * @covers WPSEO_MyYoast_Route::register_hooks
	 */
	public function test_register_hooks_with_invalid_route_action() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'is_myyoast_route', 'can_access_route', 'is_valid_action' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_myyoast_route' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'can_access_route' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'is_valid_action' )
			->will( $this->returnValue( false ) );

		$instance->register_hooks();

		$this->assertFalse( has_action( 'admin_menu', array( $instance, 'register_route' ) ) );
		$this->assertFalse( has_action( 'admin_init', array( $instance, 'handle_route' ) ) );
	}

	/**
	 * Tests registrations of the hooks with every condition being okay.
	 *
	 * @covers WPSEO_MyYoast_Route::register_hooks
	 */
	public function test_register_hooks() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'is_myyoast_route', 'can_access_route', 'is_valid_action' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_myyoast_route' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'can_access_route' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'is_valid_action' )
			->will( $this->returnValue( true ) );

		$instance->register_hooks();

		$this->assertNotFalse( has_action( 'admin_menu', array( $instance, 'register_route' ) ) );
		$this->assertNotFalse( has_action( 'admin_init', array( $instance, 'handle_route' ) ) );
	}

	/**
	 * Tests handling the route.
	 *
	 * @covers WPSEO_MyYoast_Route::handle_route
	 */
	public function test_handle_route() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'get_action', 'connect' , 'stop_execution' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_action' )
			->will( $this->returnValue( 'connect' ) );

		$instance
			->expects( $this->once() )
			->method( 'connect' );

		$instance->handle_route();
	}

	/**
	 * Tests the is myyoast route check.
	 *
	 * @covers WPSEO_MyYoast_Route::is_myyoast_route
	 */
	public function test_is_myyoast_route() {
		$instance = new WPSEO_MyYoast_Route_Double();

		$this->assertTrue( $instance->is_myyoast_route( 'wpseo_myyoast' ) );
		$this->assertFalse( $instance->is_myyoast_route( 'another_route' ) );
	}

	/**
	 * Tests if the given action is a valid action.
	 *
	 * @covers WPSEO_MyYoast_Route::is_valid_action
	 */
	public function test_is_valid_action() {
		$instance = new WPSEO_MyYoast_Route_Double();

		$this->assertTrue( $instance->is_valid_action( 'connect' ) );
		$this->assertFalse( $instance->is_valid_action( 'invalid_action' ) );
	}

	/**
	 * Tests connect.
	 *
	 * @covers WPSEO_MyYoast_Route::connect
	 */
	public function test_connect() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods( array( 'redirect', 'save_client_id', 'generate_uuid' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'save_client_id' )
			->with( '9740f9cf-608e-4327-8a16-24e3ff6a4c0d' );

		$instance
			->expects( $this->once() )
			->method( ( 'generate_uuid' ) )
			->will( $this->returnValue( '9740f9cf-608e-4327-8a16-24e3ff6a4c0d' ) );

		$instance
			->expects( $this->once() )
			->method( 'redirect' )
			->with(
				'https://my.yoast.com/connect',
				array(
					'url'             => WPSEO_Utils::get_home_url(),
					'client_id'       => '9740f9cf-608e-4327-8a16-24e3ff6a4c0d',
					'extensions'      => array(),
					'redirect_url'    => admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER ),
					'credentials_url' => rest_url( 'yoast/v1/myyoast/connect' )
				)
			);

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->connect();
	}
}
