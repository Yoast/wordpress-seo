<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_Interface;

/**
 * Represents the free sparks endpoint.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 */
class Free_Sparks_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return 'free_sparks';
	}

	/**
	 * Gets the namespace.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return Free_Sparks_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return Free_Sparks_Route::ROUTE_PREFIX;
	}

	/**
	 * Gets the URL.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
