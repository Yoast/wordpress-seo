<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

use Brain\Monkey\Functions;

/**
 * Test class for the register_routes method.
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Consent_Management_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Consent_Management_Route_Register_Routes_Test extends Abstract_Site_Kit_Consent_Management_Route_Test {

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
				'/site_kit_manage_consent',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_site_kit_consent' ],
						'permission_callback' => [ $this->instance, 'check_capabilities' ],
						'args'                => [
							'consent' => [
								'required'          => true,
								'type'              => 'bool',
								'sanitize_callback' => 'rest_sanitize_boolean',
							],

						],
					],
				]
			);

		$this->instance->register_routes();
	}
}
