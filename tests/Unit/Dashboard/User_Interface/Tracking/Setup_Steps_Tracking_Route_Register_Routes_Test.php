<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Brain\Monkey\Functions;

/**
 * Test class for the register_routes method.
 *
 * @group setup_steps_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_Route_Register_Routes_Test extends Abstract_Setup_Steps_Tracking_Route_Test {

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
				'/setup_steps_tracking',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'track_setup_steps' ],
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
								'enum'              => [ 'install', 'activate', 'setup', 'grantConsent', 'successfullyConnected' ],
							],
							'last_interaction_stage' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'install', 'activate', 'setup', 'grantConsent', 'successfullyConnected' ],
							],
							'setup_widget_temporarily_dismissed' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'yes', 'no' ],
							],
							'setup_widget_permanently_dismissed' => [
								'required'          => false,
								'type'              => 'string',
								'enum'              => [ 'yes', 'no' ],
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}
}
