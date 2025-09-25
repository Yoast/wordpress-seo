<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Ai_Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
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
class Get_Suggestions_Route implements Route_Interface {

	use No_Conditionals;
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
	public const ROUTE_PREFIX = '/ai_generator/get_suggestions';

	/**
	 * The suggestions provider instance.
	 *
	 * @var Suggestions_Provider
	 */
	private $suggestions_provider;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Suggestions_Route::get_conditionals' );
		return [ AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param Suggestions_Provider $suggestions_provider The suggestions provider instance.
	 */
	public function __construct( Suggestions_Provider $suggestions_provider ) {
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Suggestions_Route::register_routes' );
	}

	/**
	 * Runs the callback to get AI-generated suggestions.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the get_suggestions action.
	 */
	public function get_suggestions( WP_REST_Request $request ): WP_REST_Response {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Get_Suggestions_Route::get_suggestions' );

		return new WP_REST_Response( '' );
	}
}
