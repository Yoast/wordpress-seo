<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Route;

use Brain\Monkey;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route;

/**
 * Tests register_routes.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Posts_Route_Test {

	/**
	 * Tests the registration of the route.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/bulk_editor/posts',
				[
					'methods'             => 'GET',
					'args'                => [
						'content_type' => [
							'required'          => true,
							'type'              => 'string',
							'description'       => 'The content type to fetch posts for.',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'per_page'     => [
							'required'          => false,
							'type'              => 'integer',
							'default'           => 20,
							'minimum'           => 1,
							'maximum'           => 100,
							'description'       => 'The number of posts to fetch.',
							'sanitize_callback' => 'absint',
						],
					],
					'callback'            => [ $this->instance, 'get_posts' ],
					'permission_callback' => [ $this->instance, 'check_permissions' ],
				],
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests the route has no conditionals.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [], Posts_Route::get_conditionals() );
	}
}
