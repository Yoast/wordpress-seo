<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI\Generator\User_Interface\Bust_Subscription_Cache_Route;

/**
 * Represents the bust subscription cache endpoint.
 */
class Bust_Subscription_Cache_Endpoint implements Generator_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'bustSubscriptionCache';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Bust_Subscription_Cache_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Bust_Subscription_Cache_Route::ROUTE_PREFIX;
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
