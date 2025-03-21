<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints;

use Exception;
use Yoast\WP\SEO\Dashboard\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Site_Kit_Usage_Tracking_Route;

/**
 * Represents the Site Kit usage tracking endpoint.
 */
class Site_Kit_Usage_Tracking_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'siteKitUsageTracking';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Site_Kit_Usage_Tracking_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 */
	public function get_route(): string {
		return Site_Kit_Usage_Tracking_Route::ROUTE_PREFIX;
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
