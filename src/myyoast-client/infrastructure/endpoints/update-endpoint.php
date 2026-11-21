<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Endpoints;

use Yoast\WP\SEO\MyYoast_Client\User_Interface\Management_Route;

/**
 * Represents the MyYoast update-registration endpoint (PUT on /registration).
 */
class Update_Endpoint implements Management_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'update';
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
		return Management_Route::ROUTE_PREFIX . Management_Route::REGISTRATION_ROUTE;
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
