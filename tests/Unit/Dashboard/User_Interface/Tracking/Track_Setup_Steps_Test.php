<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Test class for the track_site_kit_usage method.
 *
 * @group site_kit_usage_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Site_Kit_Usage_Tracking_Route::track_site_kit_usage
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Track_Site_Kit_Usage_Test extends Abstract_Site_Kit_Usage_Tracking_Route_Test {

	/**
	 * Tests the track_site_kit_usage route's happy path.
	 *
	 * @dataProvider track_site_kit_usage_provider
	 *
	 * @param bool   $expected_success        If the request has been successful.
	 * @param int    $expected_status         The expected status code.
	 * @param string $setup_widget_loaded     The value of the option to set.
	 * @param string $first_interaction_stage The value of the option to set.
	 * @param string $last_interaction_stage  The value of the option to set.
	 * @param string $setup_widget_dismissed  The value of the option to set.
	 *
	 * @return void
	 */
	public function test_track_site_kit_usage( $expected_success, $expected_status, $setup_widget_loaded, $first_interaction_stage, $last_interaction_stage, $setup_widget_dismissed ) {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'success' => $expected_success,
				],
				$expected_status
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setup_widget_loaded' )
			->andReturn( $setup_widget_loaded );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'first_interaction_stage' )
			->andReturn( $first_interaction_stage );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'last_interaction_stage' )
			->andReturn( $last_interaction_stage );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setup_widget_dismissed' )
			->andReturn( $setup_widget_dismissed );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->track_site_kit_usage( $wp_rest_request )
		);
	}

	/**
	 * Data provider for the set_site_kit_configuration_permanent_dismissal test.
	 *
	 * @return array<array<bool, int>>
	 */
	public static function track_site_kit_usage_provider() {
		return [
			'Update site_kit_usage_tracking succeeded' => [ true, 200, 'yes', 'SET UP', 'SET UP', 'no' ],
			'Update site_kit_usage_tracking failed'    => [ true, 200, 'yes', null, null, null ],
		];
	}
}
