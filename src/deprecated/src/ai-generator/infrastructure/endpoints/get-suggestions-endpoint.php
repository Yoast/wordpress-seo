<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints;

use Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route;

/**
 * Represents the setup steps tracking endpoint.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 */
class Get_Suggestions_Endpoint implements Endpoint_Interface {

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
		return 'getSuggestions';
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
		return Get_Suggestions_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return Get_Suggestions_Route::ROUTE_PREFIX;
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
