<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Endpoints;

use Yoast\WP\SEO\MyYoast_Client\User_Interface\Management_Route;

/**
 * Represents the MyYoast refresh-status endpoint.
 */
class Refresh_Status_Endpoint implements Management_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'refreshStatus';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Management_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Management_Route::ROUTE_PREFIX . Management_Route::REFRESH_STATUS_ROUTE;
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
