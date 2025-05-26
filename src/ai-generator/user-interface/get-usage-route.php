<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\User_Interface;

use WP_REST_Response;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
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

	use Route_Permission_Trait;

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
	 * The token manager instance.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * The request handler instance.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param Token_Manager   $token_manager   The token manager instance.
	 * @param Request_Handler $request_handler The request handler instance.
	 */
	public function __construct( Token_Manager $token_manager, Request_Handler $request_handler ) {
		$this->token_manager   = $token_manager;
		$this->request_handler = $request_handler;
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
			$token           = $this->token_manager->get_or_request_access_token( $user );
			$request_headers = [
				'Authorization' => "Bearer $token",
			];

			$response = $this->request_handler->handle( new Request( '/usage/' . \gmdate( 'Y-m' ), [], $request_headers, false ) );
			$data     = \json_decode( $response->get_body() );

		}  catch ( Remote_Request_Exception | WP_Request_Exception $e ) {
			return new WP_REST_Response(
				'Failed to get usage: ' . $e->getMessage(),
				$e->getCode()
			);
		}

		return new WP_REST_Response( $data );
	}
}
