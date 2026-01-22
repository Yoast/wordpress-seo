<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Complete_Task;

use Brain\Monkey;

/**
 * Test class for register_routes.
 *
 * @group Complete_Task_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Complete_Task_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Complete_Task_Route_Register_Routes_Test extends Abstract_Complete_Task_Route_Test {

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
				'/complete_task',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'complete_task' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
						'args'                => [
							'options' => [
								'type'       => 'object',
								'required'   => true,
								'properties' => [
									'task' => [
										'type'              => 'string',
										'required'          => true,
										'sanitize_callback' => 'sanitize_text_field',
									],
								],
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}
}
