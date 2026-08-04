<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Route;

use Brain\Monkey;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route;

/**
 * Tests register_routes.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Routes_Test extends Abstract_Posts_Route_Test {

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
				'/bulk_editor/posts',
				[
					'methods'             => 'GET',
					'args'                => [
						'content_type'      => [
							'required'          => true,
							'type'              => 'string',
							'description'       => 'The content type to fetch posts for.',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'per_page'          => [
							'required'          => false,
							'type'              => 'integer',
							'default'           => 20,
							'minimum'           => 1,
							'maximum'           => 100,
							'description'       => 'The number of posts to fetch.',
							'sanitize_callback' => 'absint',
						],
						'page'              => [
							'required'          => false,
							'type'              => 'integer',
							'default'           => 1,
							'minimum'           => 1,
							'description'       => 'The page of posts to fetch.',
							'sanitize_callback' => 'absint',
						],
						'search'            => [
							'required'          => false,
							'type'              => 'string',
							'default'           => '',
							'description'       => 'The term to search posts by.',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'status'            => [
							'required'    => false,
							'type'        => 'array',
							'default'     => Posts_Collector_Interface::STATUSES,
							'items'       => [
								'type' => 'string',
								'enum' => Posts_Collector_Interface::STATUSES,
							],
							'description' => 'The post statuses to include.',
						],
						'needs_improvement' => [
							'required'    => false,
							'type'        => 'array',
							'default'     => [],
							'items'       => [
								'type' => 'string',
								'enum' => Posts_Collector_Interface::NEEDS_IMPROVEMENT_FIELDS,
							],
							'description' => 'The fields to filter posts by; a field matches when it is empty, or (for search fields with SEO analysis enabled) when its score needs improvement.',
						],
						'include'           => [
							'required'    => false,
							'type'        => 'array',
							'default'     => [],
							'maxItems'    => 100,
							'items'       => [
								'type'    => 'integer',
								'minimum' => 1,
							],
							'description' => 'Limits the posts to these post IDs, e.g. a selection carried over from the posts overview.',
						],
					],
					'callback'            => [ $this->instance, 'get_posts' ],
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
		$this->assertSame( [], Posts_Route::get_conditionals() );
	}
}
