<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Test class for the track_setup_steps method.
 *
 * @group site_kit_usage_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route::track_setup_steps
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Track_Setup_Steps_Test extends Abstract_Setup_Steps_Tracking_Route_Test {

	/**
	 * Tests the track_setup_steps route's happy path.
	 *
	 * @dataProvider track_setup_steps_provider
	 *
	 * @param bool   $expected_success                   If the request has been successful.
	 * @param int    $expected_status                    The expected status code.
	 * @param string $setup_widget_loaded                If the widget has been loaded.
	 * @param string $first_interaction_stage            The first interaction stage.
	 * @param string $last_interaction_stage             The last interaction stage.
	 * @param string $setup_widget_temporarily_dismissed If the widget has been temporarily dismissed.
	 * @param string $setup_widget_permanently_dismissed If the widget has been permanently dismissed.
	 *
	 * @return void
	 */
	public function test_track_setup_steps( $expected_success, $expected_status, $setup_widget_loaded, $first_interaction_stage, $last_interaction_stage, $setup_widget_temporarily_dismissed, $setup_widget_permanently_dismissed ) {

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
			->with( 'setupWidgetLoaded' )
			->andReturn( $setup_widget_loaded );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'firstInteractionStage' )
			->andReturn( $first_interaction_stage );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'lastInteractionStage' )
			->andReturn( $last_interaction_stage );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetTemporarilyDismissed' )
			->andReturn( $setup_widget_temporarily_dismissed );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetPermanentlyDismissed' )
			->andReturn( $setup_widget_permanently_dismissed );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->track_setup_steps( $wp_rest_request )
		);
	}

	/**
	 * Data provider for the set_site_kit_configuration_permanent_dismissal test.
	 *
	 * @return array<array<bool, int>>
	 */
	public static function track_setup_steps_provider() {
		return [
			'Update site_kit_tracking succeeded' => [ true, 200, 'yes', 'setup', 'setup', 'no', 'no' ],
			'Update site_kit_tracking failed'    => [ true, 200, 'yes', null, null, null, null ],
		];
	}
}
