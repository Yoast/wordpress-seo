<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI_Generator\Application\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get suggestions from the AI API
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Get_Usage_Route implements Route_Interface {

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
	public const ROUTE_PREFIX = '/ai_generator/get_usage';

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
				'methods'             => 'POST',
				'callback'            => [ $this, 'get_usage' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			]
		);
	}

	/**
	 * Runs the callback that gets the monthly usage of the user.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function get_usage(): WP_REST_Response {
		$user = \wp_get_current_user();
		try {
			$token           = $this->get_or_request_access_token( $user );
			$request_headers = [
				'Authorization' => "Bearer $token",
			];

			$response = $this->ai_generator_helper->request( '/usage/' . \gmdate( 'Y-m' ), [], $request_headers, false );
			$data     = \json_decode( $response->body );

		}  catch ( Remote_Request_Exception $e ) {
			return new WP_REST_Response(
				'Failed to get usage: ' . $e->getMessage(),
				$e->getCode()
			);
		}

		return new WP_REST_Response( $data );
	}

	/**
	 * Checks:
	 * - if the user is logged
	 * - if the user can edit posts
	 *
	 * @return bool Whether the user is logged in, can edit posts and the feature is active.
	 */
	public function check_permissions(): bool {
		$user = \wp_get_current_user();
		if ( $user === null || $user->ID < 1 ) {
			return false;
		}

		return \user_can( $user, 'edit_posts' );
	}
}
