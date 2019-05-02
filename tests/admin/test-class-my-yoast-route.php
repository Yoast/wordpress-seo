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
	 * Tests registrations of the hooks without being on the My Yoast route.
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
	 * Tests registration of the hooks without having enough rights.
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
	 * Tests handling the route for the connect action.
	 *
	 * @covers WPSEO_MyYoast_Route::handle_route
	 */
	public function test_handle_route_for_unknown_action() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'get_action' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_action' )
			->will( $this->returnValue( 'unknown' ) );

		$instance->handle_route();
	}

	/**
	 * Tests handling the route for the connect action.
	 *
	 * @covers WPSEO_MyYoast_Route::handle_route
	 */
	public function test_handle_route_for_connect() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'get_action', 'connect' ) )
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
	 * Tests handling the route for the authorize action.
	 *
	 * @covers WPSEO_MyYoast_Route::handle_route
	 */
	public function test_handle_route_for_authorize() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route' )
			->setMethods( array( 'get_action', 'authorize' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_action' )
			->will( $this->returnValue( 'authorize' ) );

		$instance
			->expects( $this->once() )
			->method( 'authorize' );

		$instance->handle_route();
	}

	/**
	 * Tests the is My Yoast route check.
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
			->setMethods( array( 'redirect', 'save_client_id', 'generate_uuid', 'get_extensions' ) )
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
			->method( ( 'get_extensions' ) )
			->will( $this->returnValue( array( 'yoast-seo-extension' ) ) );

		$instance
			->expects( $this->once() )
			->method( 'redirect' )
			->with(
				'https://my.yoast.com/connect',
				array(
					'url'             => WPSEO_Utils::get_home_url(),
					'client_id'       => '9740f9cf-608e-4327-8a16-24e3ff6a4c0d',
					'extensions'      => array( 'yoast-seo-extension' ),
					'redirect_url'    => admin_url( 'admin.php?page=' . WPSEO_MyYoast_Route::PAGE_IDENTIFIER . '&action=complete' ),
					'credentials_url' => rest_url( 'yoast/v1/myyoast/connect' ),
					'type'            => 'wordpress',
				)
			);

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->connect();
	}

	/**
	 * Tests authorizing without having a config.
	 *
	 * @covers WPSEO_MyYoast_Route::authorize
	 */
	public function test_authorize_without_having_configuration() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods( array( 'get_client' ) )
			->getMock();

		$client = $this
			->getMockBuilder( 'WPSEO_MyYoast_Client' )
			->setMethods( array( 'has_configuration' ) )
			->getMock();

		$client
			->expects( $this->once() )
			->method( 'has_configuration' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->once() )
			->method( 'get_client' )
			->will( $this->returnValue( $client ) );

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->authorize();
	}

	/**
	 * Tests authorizing with having a config.
	 *
	 * @covers WPSEO_MyYoast_Route::authorize
	 */
	public function test_authorize_with_having_a_configuration() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods( array( 'get_client', 'redirect' ) )
			->getMock();

		$provider = $this
			->getMockBuilder( 'Provider' )
			->setMethods( array( 'getAuthorizationUrl' ) )
			->getMock();

		$provider
			->expects( $this->once() )
			->method( 'getAuthorizationUrl' )
			->will( $this->returnValue( 'http://example.org/authorize' ) );

		$client = $this
			->getMockBuilder( 'WPSEO_MyYoast_Client' )
			->setMethods( array( 'has_configuration', 'get_provider' ) )
			->getMock();

		$client
			->expects( $this->once() )
			->method( 'has_configuration' )
			->will( $this->returnValue( true ) );

		$client
			->expects( $this->once() )
			->method( 'get_provider' )
			->will( $this->returnValue( $provider ) );

		$instance
			->expects( $this->once() )
			->method( 'get_client' )
			->will( $this->returnValue( $client ) );

		$instance
			->expects( $this->once() )
			->method( 'redirect' )
			->with( 'http://example.org/authorize' );

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->authorize();
	}

	/**
	 * Tests completion without having a config.
	 *
	 * @covers WPSEO_MyYoast_Route::complete
	 */
	public function test_complete_without_having_configuration() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods( array( 'get_client' ) )
			->getMock();

		$client = $this
			->getMockBuilder( 'WPSEO_MyYoast_Client' )
			->setMethods( array( 'has_configuration' ) )
			->getMock();

		$client
			->expects( $this->once() )
			->method( 'has_configuration' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->once() )
			->method( 'get_client' )
			->will( $this->returnValue( $client ) );

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->complete();
	}

	/**
	 * Tests connecting with having a config.
	 *
	 * @covers WPSEO_MyYoast_Route::complete
	 */
	public function test_complete_with_having_a_configuration() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods(
				array(
					'get_client',
					'redirect_to_premium_page',
					'get_authorization_code',
					'get_current_user_id',
				)
			)
			->getMock();

		$provider = $this
			->getMockBuilder( 'Provider' )
			->setMethods( array( 'getAccessToken' ) )
			->getMock();

		$provider
			->expects( $this->once() )
			->method( 'getAccessToken' )
			->with(
				'authorization_code',
				array( 'code' => 'this-is-the-code' )
			)
			->will( $this->returnValue( 'access-token' ) );

		$client = $this
			->getMockBuilder( 'WPSEO_MyYoast_Client' )
			->setMethods(
				array(
					'has_configuration',
					'get_provider',
					'save_access_token',
				)
			)
			->getMock();

		$client
			->expects( $this->once() )
			->method( 'has_configuration' )
			->will( $this->returnValue( true ) );

		$client
			->expects( $this->once() )
			->method( 'get_provider' )
			->will( $this->returnValue( $provider ) );

		$client
			->expects( $this->once() )
			->method( 'save_access_token' )
			->with( 123456789, 'access-token' );

		$instance
			->expects( $this->once() )
			->method( 'get_client' )
			->will( $this->returnValue( $client ) );

		$instance
			->expects( $this->once() )
			->method( 'get_authorization_code' )
			->will( $this->returnValue( 'this-is-the-code' ) );

		$instance
			->expects( $this->once() )
			->method( 'get_current_user_id' )
			->will( $this->returnValue( 123456789 ) );

		$instance
			->expects( $this->once() )
			->method( 'redirect_to_premium_page' );

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->complete();
	}

	/**
	 * Tests connecting with having a config.
	 *
	 * @covers WPSEO_MyYoast_Route::complete
	 */
	public function test_complete_with_exception_thrown_by_provider() {
		$instance = $this
			->getMockBuilder( 'WPSEO_MyYoast_Route_Double' )
			->setMethods(
				array(
					'get_client',
					'redirect_to_premium_page',
					'get_authorization_code',
				)
			)
			->getMock();

		$provider = $this
			->getMockBuilder( 'Provider' )
			->setMethods( array( 'getAccessToken' ) )
			->getMock();

		$provider
			->expects( $this->once() )
			->method( 'getAccessToken' )
			->with(
				'authorization_code',
				array( 'code' => 'this-is-the-code' )
			)
			->will( $this->throwException( new Exception( 'Something went wrong' ) ) );

		$client = $this
			->getMockBuilder( 'WPSEO_MyYoast_Client' )
			->setMethods(
				array(
					'has_configuration',
					'get_provider',
					'save_access_token',
				)
			)
			->getMock();

		$client
			->expects( $this->once() )
			->method( 'has_configuration' )
			->will( $this->returnValue( true ) );

		$client
			->expects( $this->once() )
			->method( 'get_provider' )
			->will( $this->returnValue( $provider ) );

		$client
			->expects( $this->never() )
			->method( 'save_access_token' );

		$instance
			->expects( $this->once() )
			->method( 'get_client' )
			->will( $this->returnValue( $client ) );

		$instance
			->expects( $this->once() )
			->method( 'get_authorization_code' )
			->will( $this->returnValue( 'this-is-the-code' ) );


		$instance
			->expects( $this->once() )
			->method( 'redirect_to_premium_page' );

		/**
		 * @var WPSEO_MyYoast_Route_Double $instance
		 */
		$instance->complete();
	}
}
