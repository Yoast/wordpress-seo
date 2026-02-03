<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Available_Posts;

use Brain\Monkey\Functions;

/**
 * Test class for the register_routes method.
 *
 * @group available_posts_route
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Available_Posts_Route_Register_Routes_Test extends Abstract_Available_Posts_Route_Test {

	/**
	 * Tests the registration of the routes.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/available_posts',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_available_posts' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
						'args'                => [
							'search'   => [
								'type'              => 'string',
								'sanitize_callback' => 'sanitize_text_field',
								'default'           => '',
							],
							'postType' => [
								'type'              => 'string',
								'sanitize_callback' => 'sanitize_text_field',
								'default'           => 'page',
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}
}
