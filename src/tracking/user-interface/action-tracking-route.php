<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tracking\User_Interface;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;
use Yoast\WP\SEO\Tracking\Domain\Exceptions\Invalid_Tracked_Action_Exception;

/**
 * Registers a route to track user actions.
 */
class Action_Tracking_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 *  The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 *  The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/action_tracking';

	/**
	 * Holds the action tracker instance.
	 *
	 * @var Action_Tracker
	 */
	private $action_tracker;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the class.
	 *
	 * @param Action_Tracker    $action_tracker    The action tracker.
	 * @param Capability_Helper $capability_helper The capability helper.
	 * @param Options_Helper    $options_helper    The options helper.
	 */
	public function __construct(
		Action_Tracker $action_tracker,
		Capability_Helper $capability_helper,
		Options_Helper $options_helper
	) {
		$this->action_tracker    = $action_tracker;
		$this->capability_helper = $capability_helper;
		$this->options_helper    = $options_helper;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'track_action' ],
					'permission_callback' => [ $this, 'check_capabilities' ],
					'args'                => [
						'action' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
					],
				],
			]
		);
	}

	/**
	 * Tracks an action.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The success or failure response.
	 *
	 * @throws Invalid_Tracked_Action_Exception When the given action is invalid.
	 */
	public function track_action( WP_REST_Request $request ): WP_REST_Response {
		$action_to_track = $request->get_param( 'action' );

		try {
			if ( ! \in_array( $action_to_track, $this->options_helper->get_tracking_only_options(), true ) ) {
				throw new Invalid_Tracked_Action_Exception();
			}

			$this->action_tracker->track_version_for_performed_action( $action_to_track );
		} catch ( Exception $exception ) {
			return new WP_REST_Response(
				[
					'success' => false,
					'error'   => $exception->getMessage(),
				],
				$exception->getCode()
			);
		}

		return new WP_REST_Response(
			[
				'success' => true,
				'action'  => $action_to_track,
			],
			200
		);
	}

	/**
	 * Checks if the current user has the required capabilities.
	 *
	 * @return bool
	 */
	public function check_capabilities() {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}
}
