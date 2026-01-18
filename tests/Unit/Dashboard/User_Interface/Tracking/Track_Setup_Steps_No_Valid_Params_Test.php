<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Mockery;
use WP_REST_Request;

/**
 * Test class for the track_setup_steps method.
 *
 * @group site_kit_usage_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route::track_setup_steps
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Track_Setup_Steps_No_Valid_Params_Test extends Abstract_Setup_Steps_Tracking_Route_Test {

	/**
	 * Tests the track_setup_steps route response in case no data is passed.
	 *
	 * @return void
	 */
	public function test_track_setup_steps() {

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetLoaded' )
			->andReturn( null );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'firstInteractionStage' )
			->andReturn( null );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'lastInteractionStage' )
			->andReturn( null );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetTemporarilyDismissed' )
			->andReturn( null );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetPermanentlyDismissed' )
			->andReturn( null );

		$this->assertInstanceOf(
			'WP_Error',
			$this->instance->track_setup_steps( $wp_rest_request )
		);
	}
}
