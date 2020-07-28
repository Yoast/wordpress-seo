<?php
/**
 * SEMrush route.
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Semrush\Semrush_Login_Action;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Phrases_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * SEMrush_Route class.
 */
class SEMrush_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * The SEMrush route prefix.
	 *
	 * @var string
	 */
	const ROUTE_PREFIX = 'semrush';

	/**
	 * The authenticate route constant.
	 *
	 * @var string
	 */
	const AUTHENTICATION_ROUTE = self::ROUTE_PREFIX . '/authenticate';

	/**
	 * The request related keyphrases route constant.
	 *
	 * @var string
	 */
	const RELATED_KEYPHRASES_ROUTE = self::ROUTE_PREFIX . '/related_keyphrases';

	/**
	 * The full login route constant.
	 *
	 * @var string
	 */
	const FULL_AUTHENTICATION_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHENTICATION_ROUTE;

	/**
	 * The login action.
	 *
	 * @var SEMrush_Login_Action
	 */
	private $login_action;

	/**
	 * The phrases action.
	 *
	 * @var SEMrush_Phrases_Action
	 */
	private $phrases_action;

	/**
	 * Semrush_Route constructor.
	 *
	 * @param Semrush_Login_Action   $login_action   The login action.
	 * @param SEMrush_Phrases_Action $phrases_action The phrases action.
	 */
	public function __construct( Semrush_Login_Action $login_action, SEMrush_Phrases_Action $phrases_action ) {
		$this->login_action   = $login_action;
		$this->phrases_action = $phrases_action;
	}

	/**
	 * @inheritDoc
	 */
	public function register_routes() {
		$route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'authenticate' ],
			'permission_callback' => [ $this, 'can_perform_request' ],
			'args'                => [
				'code' => [
					'validate_callback' => [ $this, 'has_valid_code' ],
					'required'          => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::AUTHENTICATION_ROUTE, $route_args );

		$route_args = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'get_related_keyphrases' ],
			'permission_callback' => [ $this, 'can_perform_request' ],
			'args'                => [
				'keyphrase' => [
					'validate_callback' => [ $this, 'has_valid_keyphrase' ],
					'required'          => true,
				],
				'database'  => [
					'required' => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::RELATED_KEYPHRASES_ROUTE, $route_args );
	}

	/**
	 * Authenticates with SEMrush.
	 *
	 * @param WP_REST_Request $request The request. This request should have a code param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function authenticate( WP_REST_Request $request ) {
		$data = $this
			->login_action
			->authenticate( $request['code'] );

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Checks if a valid code was returned.
	 *
	 * @param string $code The code to check.
	 *
	 * @return boolean Whether or not the code is valid.
	 */
	public function has_valid_code( $code ) {
		return $code !== '';
	}

	/**
	 * Checks if a valid keyphrase is provided.
	 *
	 * @param string $keyphrase The keyphrase to check.
	 *
	 * @return boolean Whether or not the keyphrase is valid.
	 */
	public function has_valid_keyphrase( $keyphrase ) {
		return trim( $keyphrase ) !== '';
	}

	/**
	 * Gets the related keyphrases based on the passed keyphrase and database code.
	 *
	 * @param WP_REST_Request $request The request. This request should have a keyphrase and database param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_related_keyphrases( WP_REST_Request $request ) {
		$data = $this
			->phrases_action
			->get_related_keyphrases(
				$request['keyphrase'],
				$request['database']
			);

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Determines whether the current user can perform an API request.
	 *
	 * @return bool Whether or not the current user can perform an API request.
	 */
	public function can_perform_request() {
		return current_user_can( 'manage_options' );
	}
}
