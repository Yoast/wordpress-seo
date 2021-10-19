<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Exception;
use Mockery;
use PHPUnit_Framework_Exception;
use PHPUnit_Framework_ExpectationFailedException;
use WP_REST_Response;
use Yoast\WP\SEO\Routes\Importing_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Importing_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Importing_Route
 *
 * @group routes
 * @group import
 */
class Importing_Route_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexing_Route
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Importing_Route();
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
				'/import/(?P<plugin>\w+)/(?P<type>\w+)',
				[
					'methods'             => [ 'POST' ],
					'callback'            => [ $this->instance, 'execute' ],
					'permission_callback' => [ $this->instance, 'can_import' ],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests whether a handler exists for all existing routes.
	 *
	 * @param string $plugin The plugin.
	 * @param string $type   The type of entity to import.
	 *
	 * @dataProvider all_routes
	 *
	 * @covers ::execute
	 * @covers ::import_aioseo_posts
	 */
	public function test_execute_import_aioseo_posts( $plugin, $type ) {
		Mockery::mock( 'overload:WP_REST_Response' );

		$wp_rest_response = $this->instance->execute(
			[
				'plugin' => $plugin,
				'type'   => $type,
			]
		);

		$this->assertInstanceOf( 'WP_Rest_Response', $wp_rest_response );
	}

	/**
	 * Data provider for test_execute_import_aioseo_posts.
	 *
	 * @return array
	 */
	public function all_routes() {
		return [
			[
				'aioseo',
				'posts',
			],
		];
	}

	/**
	 * Tests whether a WP_Error object is returned on a non-existing rount.
	 *
	 * @covers ::execute
	 */
	public function test_execute_non_existent_route() {
		$response = $this->instance->execute(
			[
				'plugin' => 'non',
				'type'   => 'existent',
			]
		);

		$this->assertEquals( false, $response );
	}
}
