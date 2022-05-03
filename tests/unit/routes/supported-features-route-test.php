<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\Addon_Installation_Conditional;
use Yoast\WP\SEO\Routes\Supported_Features_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Supported_Features_Route_Test.
 *
 * @group routes
 * @group addon-installation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Supported_Features_Route
 */
class Supported_Features_Route_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Supported_Features_Route
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		$this->instance = new Supported_Features_Route();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Addon_Installation_Conditional::class ],
			Supported_Features_Route::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/supported-features',
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_supported_features' ],
					'permission_callback' => '__return_true',
				]
			)
			->once();

		$this->instance->register_routes();
	}

	/**
	 * Tests the get_supported_features route.
	 *
	 * @covers ::get_supported_features
	 */
	public function test_get_supported_features() {
		Mockery::mock( 'overload:WP_REST_Response' );
		$actual = $this->instance->get_supported_features();

		$expected = new WP_REST_Response(
			[
				'addon-installation' => 1,
			]
		);

		$this->assertInstanceOf( 'WP_REST_Response', $actual );
		$this->assertEquals( $expected, $actual );
	}
}
