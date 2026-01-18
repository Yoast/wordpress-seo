<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;

/**
 * Represents the free sparks endpoint.
 *
 * @deprecated 26.3
 * @codeCoverageIgnore
 */
class Free_Sparks_Endpoint implements Free_Sparks_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_name' );

		return 'freeSparks';
	}

	/**
	 * Gets the namespace.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_namespace' );

		return Free_Sparks_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_route' );

		return Free_Sparks_Route::ROUTE_PREFIX;
	}

	/**
	 * Gets the URL.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_url' );

		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
