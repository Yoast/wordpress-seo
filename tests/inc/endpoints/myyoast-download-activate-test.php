<?php

namespace Yoast\WP\Free\Tests\Inc\EndPoints;

use Brain\Monkey;
use Mockery;
use Mockery\MockInterface;
use WP_REST_Request;
use WPSEO_Endpoint_MyYoast_Download_Activate;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group myyoast
 */
class MyYoast_Download_Activate_Test extends TestCase {


	/**
	 * @var MockInterface Instance of target object.
	 */
	protected $instance;

	/**
	 * @var MockInterface request object;
	 */
	protected $request;

	/**
	 * Runs the setup.
	 */
	public function setUp() {
		Mockery::mock( 'overload:WP_REST_Response' );

		$this->request = Mockery::mock( WP_REST_Request::class );
		$this->request
			->expects( 'get_param' )
			->once()
			->with( 'slug' )
			->andReturn( 'test-slug' );

		$this->instance = Mockery::mock( WPSEO_Endpoint_MyYoast_Download_Activate::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance->shouldReceive( 'require_dependencies' )->once()->andReturnNull();

		return parent::setUp();
	}

	/**
	 * Tests the handling of the request.
	 */
	public function test_handle_request() {
		Monkey\Functions\expect( 'is_wp_error')->andReturn( false );

		Mockery::mock('alias:WPSEO_Addon_Manager')
			->shouldReceive('get_plugin_file')
			->once()
			->andReturn( 'test-slug.php' );

		$this->instance
			->shouldReceive( 'run_activation' )
			->with( 'test-slug.php' )
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}

	/**
	 * Tests handling the request with a non existing plugin given as request argument.
	 */
	public function test_handle_request_with_no_plugin_file_found() {
		Mockery::mock('alias:WPSEO_Addon_Manager')
			->shouldReceive('get_plugin_file')
			->once()
			->andReturnFalse();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}

	/**
	 * Tests handling the request with an error during plugin activation.
	 */
	public function test_handle_request_with_activation_going_wrong() {
		Mockery::mock('alias:WPSEO_Addon_Manager')
			->shouldReceive('get_plugin_file')
			->once()
			->andReturn( 'test-slug.php' );

		$wp_error = Mockery::mock( \WP_Error::class );
		$wp_error
			->expects( 'get_error_message' )
			->once()
			->andReturn( 'Activation went wrong' );

		Monkey\Functions\expect( 'is_wp_error' )
			->with( $wp_error )
			->andReturn( true );

		$this->instance
			->shouldReceive( 'run_activation' )
			->once()
			->andReturn( $wp_error );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}
}
