<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Integrations_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * Integrations_Route class.
 */
class Integrations_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents the integrations route.
	 *
	 * @var string
	 */
	const INTEGRATIONS_ROUTE = '/integrations';

	/**
	 * Represents a route to check if current user has the correct capabilities.
	 *
	 * @var string
	 */
	const CHECK_CAPABILITY_ROUTE = '/check_capability';

	/**
	 * Represents a route to set the state of Semrush integration.
	 *
	 * @var string
	 */
	const SET_SEMRUSH_ACTIVE_ROUTE = '/set_semrush_active';

	/**
	 * Represents a route to set the state of Wincher integration.
	 *
	 * @var string
	 */
	const SET_WINCHER_ACTIVE_ROUTE = '/set_wincher_active';

	/**
	 * Represents a route to set the state of Ryte integration.
	 *
	 * @var string
	 */
	const SET_RYTE_ACTIVE_ROUTE = '/set_ryte_active';

	/**
	 * Represents a route to set the state of WordProof integration.
	 *
	 * @var string
	 */
	const SET_WORDPROOF_ACTIVE_ROUTE = '/set_wordproof_active';

	/**
	 * Represents a route to set the state of Zapier integration.
	 *
	 * @var string
	 */
	const SET_ZAPIER_ACTIVE_ROUTE = '/set_zapier_active';

	/**
	 * Represents a route to set the state of Algolia integration.
	 *
	 * @var string
	 */
	const SET_ALGOLIA_ACTIVE_ROUTE = '/set_algolia_active';

	/**
	 *  The integrations action.
	 *
	 * @var Integrations_Action
	 */
	private $integrations_action;

	/**
	 * Integrations_Route constructor.
	 *
	 * @param Integrations_Action $integrations_action The integrations action.
	 */
	public function __construct(
		Integrations_Action $integrations_action
	) {
		$this->integrations_action = $integrations_action;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$check_capability_route = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'check_capability' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'user_id' => [
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::CHECK_CAPABILITY_ROUTE, $check_capability_route );

		$set_semrush_active_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_semrush_active' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'active' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::SET_SEMRUSH_ACTIVE_ROUTE, $set_semrush_active_route );

		$set_wincher_active_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_wincher_active' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'active' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::SET_WINCHER_ACTIVE_ROUTE, $set_wincher_active_route );

		$set_ryte_active_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_ryte_active' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'active' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::SET_RYTE_ACTIVE_ROUTE, $set_ryte_active_route );

		$set_wordproof_active_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_wordproof_active' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'active' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::SET_WORDPROOF_ACTIVE_ROUTE, $set_wordproof_active_route );

		$set_zapier_active_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_zapier_active' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'active' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::SET_ZAPIER_ACTIVE_ROUTE, $set_zapier_active_route );

		$set_algolia_active_route = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'set_algolia_active' ],
			'permission_callback' => [ $this, 'can_manage_options' ],
			'args'                => [
				'active' => [
					'type'     => 'boolean',
					'required' => true,
				],
			],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::INTEGRATIONS_ROUTE . self::SET_ALGOLIA_ACTIVE_ROUTE, $set_algolia_active_route );
	}

	/**
	 * Checks if the current user has the right capability.
	 *
	 * @return bool
	 */
	public function can_manage_options() {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Sets Semrush integration state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_semrush_active( WP_REST_Request $request ) {
		$data = $this
			->integrations_action
			->set_integration_active( 'semrush', $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Sets Wincher integration state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_wincher_active( WP_REST_Request $request ) {
		$data = $this
			->integrations_action
			->set_integration_active( 'wincher', $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Sets Ryte integration state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_ryte_active( WP_REST_Request $request ) {
		$data = $this
			->integrations_action
			->set_integration_active( 'ryte', $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Sets WordProof integration state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_wordproof_active( WP_REST_Request $request ) {
		$data = $this
			->integrations_action
			->set_integration_active( 'wordproof', $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Sets Zapier integration state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_zapier_active( WP_REST_Request $request ) {
		$data = $this
			->integrations_action
			->set_integration_active( 'zapier', $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	/**
	 * Sets Algolia integration state.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function set_algolia_active( WP_REST_Request $request ) {
		$data = $this
			->integrations_action
			->set_integration_active( 'algolia', $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}
}
