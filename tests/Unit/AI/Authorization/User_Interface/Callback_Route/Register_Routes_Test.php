<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\User_Interface\Callback_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Callback_Route's register_routes method.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI\Authorization\User_Interface\Callback_Route::register_routes
 */
final class Register_Routes_Test extends Abstract_Callback_Route_Test {

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
				'/ai_generator/callback',
				[
					'methods'             => 'POST',
					'args'                => [
						'access_jwt'     => [
							'required'    => true,
							'type'        => 'string',
							'description' => 'The access JWT.',
						],
						'refresh_jwt'    => [
							'required'    => true,
							'type'        => 'string',
							'description' => 'The JWT to be used when the access JWT needs to be refreshed.',
						],
						'code_challenge' => [
							'required'    => true,
							'type'        => 'string',
							'description' => 'The SHA266 of the verification code used to check the authenticity of a callback call.',
						],
						'user_id'        => [
							'required'    => true,
							'type'        => 'integer',
							'description' => 'The id of the user associated to the code verifier.',
						],
					],
					'callback'            => [ $this->instance, 'callback' ],
					'permission_callback' => '__return_true',
				]
			);

		$this->instance->register_routes();
	}
}
