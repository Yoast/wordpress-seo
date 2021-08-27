<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Account_Action;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Keyphrases_Action;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Login_Action;
use Yoast\WP\SEO\Conditionals\Wincher_Enabled_Conditional;
use Yoast\WP\SEO\Main;

/**
 * Wincher_Route class.
 */
class Wincher_Route implements Route_Interface {

	/**
	 * The Wincher route prefix.
	 *
	 * @var string
	 */
	const ROUTE_PREFIX = 'wincher';

	/**
	 * The authenticate route constant.
	 *
	 * @var string
	 */
	const AUTHENTICATION_ROUTE = self::ROUTE_PREFIX . '/authenticate';

	/**
	 * The account limit route constant.
	 *
	 * @var string
	 */
	const ACCOUNT_LIMIT_ROUTE = self::ROUTE_PREFIX . '/limits';

	/**
	 * The track single keyphrase route constant.
	 *
	 * @var string
	 */
	const KEYPHRASE_TRACK_ROUTE = self::ROUTE_PREFIX . '/keyphrase/track';

	/**
	 * The track bulk keyphrases route constant.
	 *
	 * @var string
	 */
	const KEYPHRASES_TRACK_ROUTE = self::ROUTE_PREFIX . '/keyphrases/track';

	/**
	 * The keyphrases route constant.
	 *
	 * @var string
	 */
	const TRACKED_KEYPHRASES_ROUTE = self::ROUTE_PREFIX . '/keyphrases';

	/**
	 * The untrack keyphrase route constant.
	 *
	 * @var string
	 */
	const UNTRACK_KEYPHRASE_ROUTE = self::ROUTE_PREFIX . '/keyphrases/untrack';

	/**
	 * The keyphrases chart data route constant.
	 *
	 * @var string
	 */
	const KEYPHRASE_CHART_ROUTE = self::ROUTE_PREFIX . '/keyphrases/chart';

	/**
	 * The full login route constant.
	 *
	 * @var string
	 */
	const FULL_AUTHENTICATION_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHENTICATION_ROUTE;

	/**
	 * The login action.
	 *
	 * @var Wincher_Login_Action
	 */
	private $login_action;

	/**
	 * The account action.
	 *
	 * @var Wincher_Account_Action
	 */
	private $account_action;

	/**
	 * The keyphrases action.
	 *
	 * @var Wincher_Keyphrases_Action
	 */
	private $keyphrases_action;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Wincher_Enabled_Conditional::class ];
	}

	/**
	 * Wincher_Route constructor.
	 *
	 * @param Wincher_Login_Action      $login_action      The login action.
	 * @param Wincher_Account_Action    $account_action    The account action.
	 * @param Wincher_Keyphrases_Action $keyphrases_action The keyphrases action.
	 */
	public function __construct(
		Wincher_Login_Action $login_action,
		Wincher_Account_Action $account_action,
		Wincher_Keyphrases_Action $keyphrases_action
	) {
		$this->login_action      = $login_action;
		$this->account_action    = $account_action;
		$this->keyphrases_action = $keyphrases_action;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$authentication_route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'authenticate' ],
			'permission_callback' => [ $this, 'can_use_wincher' ],
			'args'                => [
				'code' => [
					'validate_callback' => [ $this, 'has_valid_code' ],
					'required'          => true,
				],
				'websiteId' => [
					'validate_callback' => [ $this, 'has_valid_website_id' ],
					'required'          => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::AUTHENTICATION_ROUTE, $authentication_route_args );

		$check_limit_route_args = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'check_limit' ],
			'permission_callback' => [ $this, 'can_use_wincher' ],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::ACCOUNT_LIMIT_ROUTE, $check_limit_route_args );

		$track_keyphrases_route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'track_keyphrases' ],
			'permission_callback' => [ $this, 'can_use_wincher' ],
			'args'                => [
				'keyphrases' => [
					'required'          => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::KEYPHRASES_TRACK_ROUTE, $track_keyphrases_route_args );

		$get_keyphrases_route_args = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'get_tracked_keyphrases' ],
			'permission_callback' => [ $this, 'can_use_wincher' ],
			'args'                => [
				'keyphrases' => [
					'required' => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::TRACKED_KEYPHRASES_ROUTE, $get_keyphrases_route_args );

		$delete_keyphrase_route_args = [
			'methods'             => 'DELETE',
			'callback'            => [ $this, 'untrack_keyphrase' ],
			'permission_callback' => [ $this, 'can_use_wincher' ],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::UNTRACK_KEYPHRASE_ROUTE, $delete_keyphrase_route_args );

		$get_keyphrase_chart_route_args = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'get_keyphrase_chart_data' ],
			'permission_callback' => [ $this, 'can_use_wincher' ],
			'args'                => [
				'keyphrases' => [
					'required' => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::KEYPHRASE_CHART_ROUTE, $get_keyphrase_chart_route_args );
	}

	/**
	 * Authenticates with Wincher.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function authenticate( WP_REST_Request $request ) {
		$data = $this
			->login_action
			->authenticate( $request['code'], $request['websiteId'] );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Gets the account limit from Wincher.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function check_limit( WP_REST_Request $request ) {
		$data = $this->account_action->check_limit();

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Posts keyphrases to track.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function track_keyphrases( WP_REST_Request $request ) {
		$data = $this->keyphrases_action->track_keyphrases( $request['keyphrases'] );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Gets the tracked keyphrases.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_tracked_keyphrases( WP_REST_Request $request ) {
		$decoded_keyphrases = json_decode( urldecode( $request['keyphrases'] ) );

		$data = $this->keyphrases_action->get_tracked_keyphrases( $decoded_keyphrases );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Untracks the tracked keyphrase.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return object The response.
	 */
	public function untrack_keyphrase( WP_REST_Request $request ) {
		$data = $this->keyphrases_action->untrack_keyphrase( $request['keyphraseID'] );

		return (object) [
			'results' => [],
			'status'  => $data->status,
		];
	}

	/**
	 * Gets the tracked keyphrases chart data.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_keyphrase_chart_data( WP_REST_Request $request ) {
		$decoded_keyphrases = json_decode( urldecode( $request['keyphrases'] ) );

		$data = $this->keyphrases_action->get_keyphrase_chart_data( $decoded_keyphrases );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Checks if a valid code was returned.
	 *
	 * @param string $code The code to check.
	 *
	 * @return bool Whether the code is valid.
	 */
	public function has_valid_code( $code ) {
		return $code !== '';
	}

	/**
	 * Checks if a valid website_id was returned.
	 *
	 * @param string $website_id The website_id to check.
	 *
	 * @return bool Whether the website_id is valid.
	 */
	public function has_valid_website_id( $website_id ) {
		return $website_id !== '';
	}

	/**
	 * Checks if a valid keyphrase is provided.
	 *
	 * @param string $keyphrase The keyphrase to check.
	 *
	 * @return bool Whether the keyphrase is valid.
	 */
	public function has_valid_keyphrase( $keyphrase ) {
		return \trim( $keyphrase ) !== '';
	}

	/**
	 * Whether the current user is allowed to edit post/pages and thus use the Wincher integration.
	 *
	 * @return bool Whether the current user is allowed to use Wincher.
	 */
	public function can_use_wincher() {
		return \current_user_can( 'edit_posts' ) || \current_user_can( 'edit_pages' );
	}
}
