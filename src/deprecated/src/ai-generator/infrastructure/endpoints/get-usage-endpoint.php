<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints;

use Exception;
use Yoast\WP\SEO\Ai_Generator\User_Interface\Get_Usage_Route;

/**
 * Represents the get usage endpoint.
 *
 * @deprecated 26.1
 * @codeCoverageIgnore
 */
class Get_Usage_Endpoint implements Generator_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_name' );

		return 'getUsage';
	}

	/**
	 * Gets the namespace.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_namespace' );

		return Get_Usage_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_route' );

		return Get_Usage_Route::ROUTE_PREFIX;
	}

	/**
	 * Gets the URL.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Usage_Endpoint::get_url' );

		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
