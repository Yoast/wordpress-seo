<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;
use Yoast\WP\SEO\Routes\Endpoint_Interface;

/**
 * Represents the free sparks endpoint.
 *
 * @deprecated 27.5
 * @codeCoverageIgnore
 */
class Free_Sparks_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return 'free_sparks';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_namespace(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return Free_Sparks_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return Free_Sparks_Route::ROUTE_PREFIX;
	}

	/**
	 * Gets the URL.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
