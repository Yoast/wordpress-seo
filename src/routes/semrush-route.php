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
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * SEMrush_Route class.
 */
class SEMrush_Route implements Route_Interface {

	use No_Conditionals;

	const ROUTE_PREFIX = 'semrush';

	/**
	 * The authenticate route constant.
	 *
	 * @var string
	 */
	const AUTHENTICATION_ROUTE = self::ROUTE_PREFIX . '/authenticate';

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
	 * Semrush_Route constructor.
	 *
	 * @param Semrush_Login_Action $login_action The login action.
	 */
	public function __construct( Semrush_Login_Action $login_action ) {
		$this->login_action = $login_action;
	}

	/**
	 * @inheritDoc
	 */
	public function register_routes() {
		$route_args = [
			'methods'  => 'POST',
			'callback' => [ $this, 'authenticate' ],
			'args'     => [
				'code' => [
					'validate_callback' => [ $this, 'has_valid_code' ],
					'required'          => true,
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::AUTHENTICATION_ROUTE, $route_args );
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
}
