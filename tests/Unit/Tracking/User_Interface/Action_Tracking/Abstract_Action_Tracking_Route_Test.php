<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\User_Interface\Action_Tracking;

use Mockery;
use WP_REST_Request;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;
use Yoast\WP\SEO\Tracking\User_Interface\Action_Tracking_Route;

/**
 * Base class for the action tracking route tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Action_Tracking_Route_Test extends TestCase {

	/**
	 * The action tracker.
	 *
	 * @var Mockery\MockInterface|Action_Tracker
	 */
	protected $action_tracker;

	/**
	 * The capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Action_Tracking_Route
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->action_tracker    = Mockery::mock( Action_Tracker::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->options_helper    = Mockery::mock( Options_Helper::class );

		$this->instance = new Action_Tracking_Route(
			$this->action_tracker,
			$this->capability_helper,
			$this->options_helper
		);
	}

	/**
	 * Creates a mock WP_REST_Request.
	 *
	 * @param string $action The action parameter value.
	 *
	 * @return Mockery\MockInterface|WP_REST_Request
	 */
	protected function create_mock_request( $action ) {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )
			->with( 'action' )
			->andReturn( $action );

		return $request;
	}
}
