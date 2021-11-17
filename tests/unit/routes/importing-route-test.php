<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Routes\Importing_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Actions\Importing\Importing_Action_Interface;

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
	 * @var Importing_Route
	 */
	protected $instance;

	/**
	 * Represents the importers to use.
	 *
	 * @var Importing_Action_Interface
	 */
	protected $importers;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( '\WP_Error' );

		$this->importers = [
			$this->mockImporter( Aioseo_Posts_Importing_Action::class, 'aioseo', 'posts' ),
		];

		$this->instance = new Importing_Route( ...$this->importers );
	}

	/**
	 * Creates a mock importing action.
	 *
	 * @param string $class  The class.
	 * @param string $plugin The plugin.
	 * @param string $type   The type.
	 *
	 * @return Importing_Action_Interface The indexing action.
	 */
	private function mockImporter( $class, $plugin, $type ) {
		$importing_action = Mockery::mock( $class )
			->shouldAllowMockingProtectedMethods();

		$importing_action->allows( 'get_plugin' )->andReturn( $plugin );
		$importing_action->allows( 'get_type' )->andReturn( $type );

		return $importing_action;
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
	 */
	public function test_execute_import_aioseo_posts( $plugin, $type ) {
		Mockery::mock( 'overload:WP_REST_Response' );

		$importer = array_values( $this->importers )[0];
		$importer->expects( 'index' )
			->once()
			->andReturn( [ 'test' ] );

		$wp_rest_response = $this->instance->execute(
			[
				'plugin' => $plugin,
				'type'   => $type,
			]
		);

		$this->assertInstanceOf( 'WP_Rest_Response', $wp_rest_response );
	}

	/**
	 * Tests getting the right endpoint for a given plugin and type.
	 *
	 * @covers ::get_endpoint
	 */
	public function test_get_endpoints() {
		$aioseo_posts_endpoint = $this->instance->get_endpoint( 'aioseo', 'posts' );
		$this->assertEquals( 'yoast/v1/import/aioseo/posts', $aioseo_posts_endpoint );

		$no_type_endpoint = $this->instance->get_endpoint( 'aioseo', false );
		$this->assertFalse( $no_type_endpoint );

		$no_plugin_endpoint = $this->instance->get_endpoint( false, 'posts' );
		$this->assertFalse( $no_plugin_endpoint );

		$no_plugin_no_type_endpoint = $this->instance->get_endpoint( false, false );
		$this->assertFalse( $no_plugin_no_type_endpoint );
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

		$this->assertInstanceOf( 'WP_Error', $response );
	}
}
