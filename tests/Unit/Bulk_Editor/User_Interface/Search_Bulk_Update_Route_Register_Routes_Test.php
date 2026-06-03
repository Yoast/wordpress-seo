<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Brain\Monkey;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Search_Bulk_Update_Route;

/**
 * Test class for register_routes.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Abstract_Bulk_Update_Route::register_routes
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Search_Bulk_Update_Route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Bulk_Update_Route_Register_Routes_Test extends Abstract_Search_Bulk_Update_Route_Test {

	/**
	 * Tests the registration of the route.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/bulk_editor/update_search',
				[
					'methods'             => 'POST',
					'args'                => [
						'items' => [
							'required'          => true,
							'type'              => 'array',
							'description'       => 'The per-post updates to apply.',
							'minItems'          => 1,
							'maxItems'          => Batch_Limit::MAX_ITEMS,
							'items'             => [
								'type'                 => 'object',
								'additionalProperties' => false,
								'properties'           => [
									'id'               => [
										'type'        => 'integer',
										'required'    => true,
										'minimum'     => 1,
										'description' => 'The ID of the post to update.',
									],
									'seo_title'        => [
										'type'        => 'string',
										'description' => 'The new title for the post.',
									],
									'meta_description' => [
										'type'        => 'string',
										'description' => 'The new description for the post.',
									],
								],
							],
							'validate_callback' => [ $this->instance, 'validate_items' ],
						],
					],
					'callback'            => [ $this->instance, 'update' ],
					'permission_callback' => [ $this->instance, 'check_permissions' ],
				],
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests the route has no conditionals.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [], Search_Bulk_Update_Route::get_conditionals() );
	}
}
