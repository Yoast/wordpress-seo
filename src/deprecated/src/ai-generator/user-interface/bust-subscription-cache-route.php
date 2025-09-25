<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\User_Interface;

use WP_REST_Response;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to bust the subscription cache.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Bust_Subscription_Cache_Route implements Route_Interface {

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
	public const ROUTE_PREFIX = '/ai_generator/bust_subscription_cache';

	/**
	 * The addon manager instance.
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Bust_Subscription_Cache_Route::get_conditionals' );
		return [ AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param WPSEO_Addon_Manager $addon_manager The addon manager instance.
	 */
	public function __construct( WPSEO_Addon_Manager $addon_manager ) {
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Bust_Subscription_Cache_Route::register_routes' );
	}

	/**
	 * Runs the callback that busts the subscription cache.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function bust_subscription_cache(): WP_REST_Response {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\\Yoast\\WP\\SEO\\AI\\Generator\\User_Interface\\Bust_Subscription_Cache_Route::bust_subscription_cache' );

		return new WP_REST_Response( '' );
	}
}
