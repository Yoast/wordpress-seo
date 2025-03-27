<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Brain\Monkey\Functions;

/**
 * Test class for the register_routes method.
 *
 * @group site_kit_usage_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Site_Kit_Usage_Tracking_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Usage_Tracking_Route_Register_Routes_Test extends Abstract_Site_Kit_Usage_Tracking_Route_Test {

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
				'/site_kit_usage_tracking',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'track_site_kit_usage' ],
						'permission_callback' => [ $this->instance, 'check_capabilities' ],
						'args'                => [
							'setup_widget_loaded' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'yes', 'no' ],
							],
							'first_interaction_stage' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'INSTALL', 'ACTIVATE', 'SET UP', 'CONNECT' ],
							],
							'last_interaction_stage' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'INSTALL', 'ACTIVATE', 'SET UP', 'CONNECT' ],
							],
							'setup_widget_dismissed' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'yes', 'no', 'permanently' ],
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}
}
