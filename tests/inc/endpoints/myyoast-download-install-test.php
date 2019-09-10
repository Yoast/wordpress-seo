<?php

namespace Yoast\WP\Free\Tests\Inc\EndPoints;

use Brain\Monkey;
use Mockery;
use Mockery\MockInterface;
use WP_REST_Request;
use WPSEO_Endpoint_MyYoast_Download_Install;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group myyoast
 */
class MyYoast_Download_Install_Test extends TestCase {

	/**
	 * @var MockInterface Instance of target object.
	 */
	protected $instance;

	/**
	 * @var MockInterface Request object;
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

		$this->instance = Mockery::mock( WPSEO_Endpoint_MyYoast_Download_Install::class )
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
			->expects('is_installed' )
			->andReturn( false );

		$this->instance
			->shouldReceive( 'request_current_subscriptions' )
			->once()
			->andReturn(
				(object) [
					(object) [
						'product' => (object) [
							'slug'     => 'test-slug',
							'download' => 'test-slug.zip',
						],
					],
				]
			);

		$this->instance
			->shouldReceive( 'run_installation' )
			->once()
			->andReturn( false );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}

	/**
	 * Tests the handling of the request for a plugin that has been installed already.
	 */
	public function test_handle_request_for_already_installed_plugin() {
		Mockery::mock('alias:WPSEO_Addon_Manager')
			->expects('is_installed' )
			->andReturn( true );

		$this->instance
			->shouldNotReceive( 'run_installation' )
			->never()
			->andReturn( false );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}

	/**
	 * Tests the handling of the request for a non existing plugin.
	 */
	public function test_handle_request_for_a_non_existing_plugin() {
		Mockery::mock('alias:WPSEO_Addon_Manager')
		        ->expects('is_installed' )
		        ->andReturn( false );

		Monkey\Functions\expect( 'is_wp_error')
			->never()
			->andReturn( false );

		$this->instance
			->shouldReceive( 'request_current_subscriptions' )
			->once()
			->andReturn(
				(object) [
					(object) [
						'product' => (object) [
							'slug'     => 'another-test-slug',
							'download' => 'another-test-slug.zip',
						],
					],
				]
			);

		$this->instance
			->shouldReceive( 'run_installation' )
			->never()
			->andReturn( false );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}

	/**
	 * Tests handling the request with an error during plugin activation.
	 */
	public function test_handle_request_with_installation_going_wrong() {
		Mockery::mock('alias:WPSEO_Addon_Manager')
		        ->expects('is_installed' )
		        ->andReturn( false );

		$wp_error = Mockery::mock( \WP_Error::class );
		$wp_error
			->expects( 'get_error_message' )
			->once()
			->andReturn( 'Installation went wrong' );

		$this->instance
			->shouldReceive( 'run_installation' )
			->once()
			->andReturn( $wp_error );

		$this->instance
			->shouldReceive( 'find_plugin_download' )
			->once()
			->andReturn( 'test-slug.zip' );

		Monkey\Functions\expect( 'is_wp_error' )
			->with( $wp_error )
			->andReturn( true );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->handle_request( $this->request )
		);
	}
}
