<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Content_Route;

use Brain\Monkey;

/**
 * Tests register_routes.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Content_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Posts_Content_Route_Test {

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
				'/bulk_editor/posts_content',
				[
					'methods'             => 'GET',
					'args'                => [
						'ids' => [
							'required'    => true,
							'type'        => 'array',
							'minItems'    => 1,
							'maxItems'    => 20,
							'items'       => [
								'type'    => 'integer',
								'minimum' => 1,
							],
							'description' => 'The IDs of the posts to return the content of. Accepts a comma separated list.',
						],
					],
					'callback'            => [ $this->instance, 'get_posts_content' ],
					'permission_callback' => [ $this->instance, 'check_permissions' ],
				],
			);

		$this->instance->register_routes();
	}
}
