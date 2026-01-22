<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Free_Sparks\User_Interface\Free_Sparks_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Free_Sparks_Route's register_routes method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route::register_routes
 */
final class Register_Routes_Test extends Abstract_Free_Sparks_Route_Test {

	/**
	 * Tests that register_routes registers the expected route.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/ai/free_sparks',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'start' ],
					'permission_callback' => [ $this->instance, 'can_edit_posts' ],
				]
			);

		$this->instance->register_routes();
	}
}
