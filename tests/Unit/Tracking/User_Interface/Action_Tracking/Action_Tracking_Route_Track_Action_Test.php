<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\User_Interface\Action_Tracking;

use Mockery;
use WP_REST_Response;

/**
 * Test class for track_action.
 *
 * @group Action_Tracking_Route
 *
 * @covers Yoast\WP\SEO\Tracking\User_Interface\Action_Tracking_Route::track_action
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Action_Tracking_Route_Track_Action_Test extends Abstract_Action_Tracking_Route_Test {

	/**
	 * Tests tracking an action successfully.
	 *
	 * @return void
	 */
	public function test_track_action_success() {
		$action  = 'valid_action';
		$request = $this->create_mock_request( $action );

		$this->options_helper->expects( 'get_tracking_only_options' )
			->once()
			->andReturn( [ 'valid_action', 'another_action' ] );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( $action );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->track_action( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests tracking an action when action is invalid.
	 *
	 * @return void
	 */
	public function test_track_action_invalid_action() {
		$action  = 'invalid_action';
		$request = $this->create_mock_request( $action );

		$this->options_helper->expects( 'get_tracking_only_options' )
			->once()
			->andReturn( [ 'valid_action', 'another_action' ] );

		// Should not track when action is invalid.
		$this->action_tracker->expects( 'track_version_for_performed_action' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->track_action( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
