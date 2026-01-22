<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\General\User_Interface\Opt_In_Route;

use Brain\Monkey;
use Yoast\WP\SEO\Main;

/**
 * Tests the Opt_In_Route register_routes method.
 *
 * @group opt-in-route
 *
 * @covers \Yoast\WP\SEO\General\User_Interface\Opt_In_Route::register_routes
 */
final class Register_Routes_Test extends Abstract_Opt_In_Route_Test {

	/**
	 * Tests the registration of the routes.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				Main::API_V1_NAMESPACE,
				'/seen-opt-in-notification',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'set_opt_in_seen' ],
					'permission_callback' => [ $this->instance, 'can_see_opt_in' ],
					'args'                => [
						'key' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => [ $this->instance, 'validate_key' ],
						],
					],
				]
			)
			->once();

		$this->instance->register_routes();
	}
}
