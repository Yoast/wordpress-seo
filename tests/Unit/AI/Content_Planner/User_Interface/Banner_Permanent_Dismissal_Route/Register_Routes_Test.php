<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;

use Brain\Monkey\Functions;
use Mockery;

/**
 * Tests the Banner_Permanent_Dismissal_Route register_routes method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Banner_Permanent_Dismissal_Route_Test {

	/**
	 * Tests that register_routes registers the expected route configuration.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		$captured_config = null;

		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/ai_content_planner/banner_permanent_dismissal',
				Mockery::on(
					static function ( $config ) use ( &$captured_config ) {
						$captured_config = $config;
						return true;
					},
				),
			);

		$this->instance->register_routes();

		$route = $captured_config[0];

		$this->assertSame( 'POST', $route['methods'] );
		$this->assertSame( [ $this->instance, 'set_banner_permanent_dismissal' ], $route['callback'] );
		$this->assertSame( [ $this->instance, 'check_capabilities' ], $route['permission_callback'] );

		$this->assertArrayHasKey( 'is_dismissed', $route['args'] );
		$this->assertTrue( $route['args']['is_dismissed']['required'] );
		$this->assertSame( 'bool', $route['args']['is_dismissed']['type'] );
		$this->assertSame( 'rest_sanitize_boolean', $route['args']['is_dismissed']['sanitize_callback'] );
	}
}
