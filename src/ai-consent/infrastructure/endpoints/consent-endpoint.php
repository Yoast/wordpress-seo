<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints;

use Exception;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route;

/**
 * Represents the setup steps tracking endpoint.
 *
 * @deprecated
 * @codeCoverageIgnore
 */
class Consent_Endpoint implements Consent_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_name' );

		return 'consent';
	}

	/**
	 * Gets the namespace.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_namespace' );

		return Consent_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_route' );

		return Consent_Route::ROUTE_PREFIX;
	}

	/**
	 * Gets the URL.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_url' );

		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
