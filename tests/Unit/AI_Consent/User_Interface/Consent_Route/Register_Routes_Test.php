<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\Consent_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Consent_Route's register_routes method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route::register_routes
 */
final class Register_Routes_Test extends Abstract_Consent_Route_Test {

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
				'/ai_generator/consent',
				[
					'methods'             => 'POST',
					'args'                => [
						'consent' => [
							'required'    => true,
							'type'        => 'boolean',
							'description' => 'Whether the consent to use AI-based services has been given by the user.',
						],
					],
					'callback'            => [ $this->instance, 'consent' ],
					'permission_callback' => [ $this->instance, 'check_permissions' ],
				]
			);

		$this->instance->register_routes();
	}
}
