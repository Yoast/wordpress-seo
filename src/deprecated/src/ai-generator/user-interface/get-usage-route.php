<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\User_Interface;

use WP_REST_Response;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get suggestions from the AI API
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
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
	 * Represents the add-on manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Usage_Route::get_conditionals' );
		return [ AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param Token_Manager       $token_manager   The token manager instance.
	 * @param Request_Handler     $request_handler The request handler instance.
	 * @param WPSEO_Addon_Manager $addon_manager   The add-on manager instance.
	 */
	public function __construct( Token_Manager $token_manager, Request_Handler $request_handler, WPSEO_Addon_Manager $addon_manager ) {
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_routes() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Usage_Route::register_routes' );
	}

	/**
	 * Runs the callback that gets the monthly usage of the user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Response $response The response object containing the parameters for the request.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function get_usage( $response ): WP_REST_Response {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Usage_Route::get_usage' );

		return new WP_REST_Response( '' );
	}

	/**
	 * Get action path for the request.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param bool $is_woo_product_entity Whether the request is for a WooCommerce product entity.
	 *
	 * @return string The action path.
	 */
	public function get_action_path( $is_woo_product_entity = false ): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Usage_Route::get_action_path' );

		return '';
	}
}
