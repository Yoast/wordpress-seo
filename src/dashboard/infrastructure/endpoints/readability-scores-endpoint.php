<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints;

use Yoast\WP\SEO\Dashboard\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route;

/**
 * Represents the readability scores endpoint.
 */
class Readability_Scores_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'readabilityScores';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Readability_Scores_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Readability_Scores_Route::ROUTE_PREFIX;
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
