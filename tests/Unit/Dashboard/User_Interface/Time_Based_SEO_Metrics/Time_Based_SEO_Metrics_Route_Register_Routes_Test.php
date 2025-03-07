<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Time_Based_SEO_Metrics;

use Brain\Monkey\Functions;

/**
 * Test class for the register_routes method.
 *
 * @group time_based_SEO_metrics_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::register_routes
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Time_Based_SEO_Metrics_Route_Register_Routes_Test extends Abstract_Time_Based_SEO_Metrics_Route_Test {

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
				'/time_based_seo_metrics',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_time_based_seo_metrics' ],
						'permission_callback' => [ $this->instance, 'permission_manage_options' ],
						'args'                => [
							'limit'   => [
								'type'              => 'int',
								'sanitize_callback' => 'absint',
								'default'           => 5,
							],
							'options' => [
								'type'       => 'object',
								'required'   => true,
								'properties' => [
									'widget' => [
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
