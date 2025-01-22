<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Test class for the set_site_kit_widget_permanent_dismissal method.
 *
 * @group site_kit_widget_permanent_dismissal_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Site_Kit_Widget_Permanent_Dismissal_Route::set_site_kit_widget_permanent_dismissal
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Site_Kit_Permanent_Dismissal_Test extends Abstract_Site_Kit_Widget_Permanent_Dismissal_Route_Test {

	/**
	 * Tests the set_introduction_seen route's happy path.
	 *
	 * @dataProvider set_site_kit_widget_permanent_dismissal_data
	 * @covers ::set_introduction_seen
	 *
	 * @param bool $is_dismissed    The value to set.
	 * @param int  $expected_status The expected status code.
	 *
	 * @return void
	 */
	public function test_set_site_kit_widget_permanent_dismissal( $is_dismissed, $expected_status ) {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => $is_dismissed,
					],
				],
				$expected_status
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_params' )
			->once()
			->andReturn(
				[
					'is_dismissed'         => $is_dismissed,
				]
			);

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_site_kit_widget_permanent_dismissal( $wp_rest_request )
		);
	}

	/**
	 * Data provider for the set_site_kit_widget_permanent_dismissal test.
	 *
	 * @return array<array<bool, int>>
	 */
	public static function set_site_kit_widget_permanent_dismissal_data() {
		return [
			'Update site_kit_widget_permanently_dismissed succeeded' => [ true, 200 ],
			'Update site_kit_widget_permanently_dismissed failed'    => [ false, 400 ],
		];
	}
}
