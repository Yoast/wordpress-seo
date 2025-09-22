<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\User_Interface;

/**
 * Registers the callback route used in the authorization process.
 *
 * @deprecated 26.1
 * @codeCoverageIgnore
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Callback_Route extends Abstract_Callback_Route {
	/**
	 *  The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/ai_generator/callback';

	/**
	 * Registers routes with WordPress.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_routes() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Authorization\User_Interface\Callback_Route::register_routes' );
	}
}
