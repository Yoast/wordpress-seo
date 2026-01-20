<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the track_setup_steps method.
 *
 * @group site_kit_usage_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route::track_setup_steps
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Track_Setup_Steps_Set_Data_Fails_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Setup_Steps_Tracking_Route
	 */
	protected $instance;

	/**
	 * Holds the mock for the capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		Mockery::mock( WP_Error::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );

		$this->instance = new Setup_Steps_Tracking_Route(
			new Setup_Steps_Tracking_Repository_Fake( true, false ),
			$this->capability_helper
		);
	}

	/**
	 * Tests the track_setup_steps route response in case data cannot be set.
	 *
	 * @return void
	 */
	public function test_track_setup_steps() {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'success' => false,
				],
				400
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetLoaded' )
			->andReturn( 'yes' );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'firstInteractionStage' )
			->andReturn( 'activate' );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'lastInteractionStage' )
			->andReturn( 'activate' );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetTemporarilyDismissed' )
			->andReturn( 'yes' );

		$wp_rest_request
			->expects( 'get_param' )
			->with( 'setupWidgetPermanentlyDismissed' )
			->andReturn( 'no' );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->track_setup_steps( $wp_rest_request )
		);
	}
}
