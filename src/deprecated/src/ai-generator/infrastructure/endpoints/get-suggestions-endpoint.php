<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints;

use Exception;
use Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route;

/**
 * Represents the setup steps tracking endpoint.
 *
 * @deprecated 27.5
 * @codeCoverageIgnore
 */
class Get_Suggestions_Endpoint implements Endpoint_Interface {

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

		return 'getSuggestions';
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

		return Get_Suggestions_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return Get_Suggestions_Route::ROUTE_PREFIX;
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
