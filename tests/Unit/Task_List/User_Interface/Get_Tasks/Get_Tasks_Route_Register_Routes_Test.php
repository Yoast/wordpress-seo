<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Get_Tasks;

use Brain\Monkey;

/**
 * Test class for register_routes.
 *
 * @group Get_Tasks_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Get_Tasks_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Tasks_Route_Register_Routes_Test extends Abstract_Get_Tasks_Route_Test {

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
				'/get_tasks',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_tasks' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
						'args'                => [
							'options' => [
								'type'       => 'object',
								'required'   => false,
								'properties' => [
									'filter' => [
										'type'              => 'string',
										'required'          => false,
										'sanitize_callback' => 'sanitize_text_field',
									],
									'limit' => [
										'type'              => 'int',
										'required'          => false,
										'sanitize_callback' => 'absint',
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
