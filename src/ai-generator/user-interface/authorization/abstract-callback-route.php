<?php

namespace Yoast\WP\SEO\AI_Generator\User_Interface\Authorization;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * The base class for the callback routes.
 */
abstract class Abstract_Callback_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 *  The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * Runs the callback to store connection credentials and the tokens locally.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function callback( WP_REST_Request $request ): WP_REST_Response {
		try {
			$code_verifier = $this->ai_generator_action->callback( $request['access_jwt'], $request['refresh_jwt'], $request['code_challenge'], $request['user_id'] );
		} catch ( Unauthorized_Exception $e ) {
			return new WP_REST_Response( 'Unauthorized.', 401 );
		}

		return new WP_REST_Response(
			[
				'message'       => 'Tokens successfully stored.',
				'code_verifier' => $code_verifier,
			]
		);
	}
}
