<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Outline_Route;

use Brain\Monkey\Functions;
use Mockery;

/**
 * Tests the Get_Outline_Route register_routes method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Get_Outline_Route_Test {

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
				'/ai_content_planner/get_outline',
				Mockery::on(
					static function ( $config ) use ( &$captured_config ) {
						$captured_config = $config;
						return true;
					},
				),
			);

		$this->instance->register_routes();

		$this->assertSame( 'POST', $captured_config['methods'] );
		$this->assertSame( [ $this->instance, 'get_outline' ], $captured_config['callback'] );
		$this->assertSame( [ $this->instance, 'check_permissions' ], $captured_config['permission_callback'] );

		$expected_string_args = [
			'post_type',
			'language',
			'editor',
			'title',
			'intent',
			'explanation',
			'keyphrase',
			'meta_description',
		];
		foreach ( $expected_string_args as $arg ) {
			$this->assertArrayHasKey( $arg, $captured_config['args'] );
			$this->assertTrue( $captured_config['args'][ $arg ]['required'] );
			$this->assertSame( 'string', $captured_config['args'][ $arg ]['type'] );
		}

		$this->assertSame(
			[ 'classic', 'elementor', 'gutenberg' ],
			$captured_config['args']['editor']['enum'],
		);

		$this->assertArrayHasKey( 'category', $captured_config['args'] );
		$category_arg = $captured_config['args']['category'];
		$this->assertFalse( $category_arg['required'] );
		$this->assertSame( 'object', $category_arg['type'] );
		$this->assertArrayHasKey( 'name', $category_arg['properties'] );
		$this->assertSame( 'string', $category_arg['properties']['name']['type'] );
		$this->assertTrue( $category_arg['properties']['name']['required'] );
		$this->assertArrayHasKey( 'id', $category_arg['properties'] );
		$this->assertSame( 'integer', $category_arg['properties']['id']['type'] );
		$this->assertTrue( $category_arg['properties']['id']['required'] );
	}
}
