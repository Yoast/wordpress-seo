<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route;

use Brain\Monkey\Functions;
use Mockery;

/**
 * Tests the Site_Schema_Aggregator_Route's register_routes method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Site_Schema_Aggregator_Route_Test {

	/**
	 * Tests that register_routes registers the expected routes.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->twice()
			->with(
				'yoast/v1',
				Mockery::type( 'string' ),
				Mockery::type( 'array' ),
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests that register_routes registers the base post type route.
	 *
	 * @return void
	 */
	public function test_register_routes_registers_post_type_route() {
		$captured_config = null;

		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'schema-aggregator/get-schema/(?P<post_type>[a-z0-9_-]+)',
				Mockery::on(
					static function ( $config ) use ( &$captured_config ) {
						$captured_config = $config;
						return true;
					},
				),
			);

		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'schema-aggregator/get-schema/(?P<post_type>[a-z0-9_-]+)/(?P<page>\d+)',
				Mockery::type( 'array' ),
			);

		$this->instance->register_routes();

		$this->assertSame( 'GET', $captured_config['methods'] );
		$this->assertSame( [ $this->instance, 'aggregate_site_schema' ], $captured_config['callback'] );
		$this->assertSame( [ $this->instance, 'get_permission_callback' ], $captured_config['permission_callback'] );
		$this->assertArrayHasKey( 'post_type', $captured_config['args'] );
		$this->assertTrue( $captured_config['args']['post_type']['required'] );
	}

	/**
	 * Tests that register_routes registers the paginated route with page argument.
	 *
	 * @return void
	 */
	public function test_register_routes_registers_paginated_route() {
		$captured_config = null;

		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'schema-aggregator/get-schema/(?P<post_type>[a-z0-9_-]+)',
				Mockery::type( 'array' ),
			);

		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'schema-aggregator/get-schema/(?P<post_type>[a-z0-9_-]+)/(?P<page>\d+)',
				Mockery::on(
					static function ( $config ) use ( &$captured_config ) {
						$captured_config = $config;
						return true;
					},
				),
			);

		$this->instance->register_routes();

		$this->assertSame( 'GET', $captured_config['methods'] );
		$this->assertSame( [ $this->instance, 'aggregate_site_schema' ], $captured_config['callback'] );
		$this->assertSame( [ $this->instance, 'get_permission_callback' ], $captured_config['permission_callback'] );
		$this->assertArrayHasKey( 'post_type', $captured_config['args'] );
		$this->assertArrayHasKey( 'page', $captured_config['args'] );
		$this->assertSame( 1, $captured_config['args']['page']['default'] );
	}
}
