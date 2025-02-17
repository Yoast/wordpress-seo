<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Search_Rankings;

use Exception;
use Yoast\WP\SEO\Dashboard\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings\Abstract_Ranking_Route;
use Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings\Top_Query_Route;

/**
 * Represents the top search queries endpoint.
 */
class Top_Query_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'topQueryResults';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Abstract_Ranking_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @throws Exception If the route prefix is not overwritten this throws.
	 * @return string
	 */
	public function get_route(): string {
		return Top_Query_Route::get_route_prefix();
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
