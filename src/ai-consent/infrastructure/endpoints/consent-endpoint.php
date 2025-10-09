<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints;

use Exception;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route;

/**
 * Represents the setup steps tracking endpoint.
 *
 * @deprecated 26.3
 * @codeCoverageIgnore
 */
class Consent_Endpoint implements Consent_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_name' );

		return 'consent';
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_namespace' );

		return Consent_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 */
	public function get_route(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_route' );

		return Consent_Route::ROUTE_PREFIX;
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_url' );

		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
