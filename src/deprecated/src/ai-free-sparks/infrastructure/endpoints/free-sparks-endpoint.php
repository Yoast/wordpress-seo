<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;

/**
 * Represents the free sparks endpoint.
 *
 * @deprecated 26.1
 * @codeCoverageIgnore
 */
class Free_Sparks_Endpoint implements Free_Sparks_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_name' );

		return '';
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_namespace' );

		return '';
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated 26.1
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_route' );

		return '';
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.1', 'Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint::get_url' );

		return '';
	}
}
