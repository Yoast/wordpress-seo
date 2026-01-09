<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\User_Interface\Action_Tracking;

use Brain\Monkey;

/**
 * Test class for register_routes.
 *
 * @group Action_Tracking_Route
 *
 * @covers Yoast\WP\SEO\Tracking\User_Interface\Action_Tracking_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Action_Tracking_Route_Register_Routes_Test extends Abstract_Action_Tracking_Route_Test {

	/**
	 * Tests the registration of the routes.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/action_tracking',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'track_action' ],
						'permission_callback' => [ $this->instance, 'check_capabilities' ],
						'args'                => [
							'action' => [
								'required'          => true,
								'type'              => 'string',
								'sanitize_callback' => 'sanitize_text_field',
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}
}
