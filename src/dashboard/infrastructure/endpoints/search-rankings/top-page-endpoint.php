<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Search_Rankings;

use Exception;
use Yoast\WP\SEO\Dashboard\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings\Abstract_Ranking_Route;
use Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings\Top_Page_Route;

/**
 * Represents the top page results endpoint.
 */
class Top_Page_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'topPageResults';
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
		return Top_Page_Route::get_route_prefix();
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
