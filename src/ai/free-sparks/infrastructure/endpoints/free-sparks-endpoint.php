<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI\Free_Sparks\User_Interface\Free_Sparks_Route;

/**
 * Represents the free sparks endpoint.
 */
class Free_Sparks_Endpoint implements Free_Sparks_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'freeSparks';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Free_Sparks_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Free_Sparks_Route::ROUTE_PREFIX;
	}

	/**
	 * Gets the URL.
	 *
	 * @return string
	 */
	public function get_url(): string {
		return \rest_url( $this->get_namespace() . $this->get_route() );
	}
}
