<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Bust_Subscription_Cache_Route's register_routes method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route::register_routes
 */
final class Register_Routes_Test extends Abstract_Bust_Subscription_Cache_Route_Test {

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
				'/ai_generator/bust_subscription_cache',
				[
					'methods'             => 'POST',
					'args'                => [],
					'callback'            => [ $this->instance, 'bust_subscription_cache' ],
					'permission_callback' => [ $this->instance, 'check_permissions' ],
				]
			);

		$this->instance->register_routes();
	}
}
