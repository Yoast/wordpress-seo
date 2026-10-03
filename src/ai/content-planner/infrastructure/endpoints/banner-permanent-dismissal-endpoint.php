<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Endpoints;

use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;

/**
 * Represents the content planner endpoint to permanently dismiss the inline banner.
 */
class Banner_Permanent_Dismissal_Endpoint implements Content_Planner_Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'bannerPermanentDismissal';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Banner_Permanent_Dismissal_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Banner_Permanent_Dismissal_Route::ROUTE_PREFIX;
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
