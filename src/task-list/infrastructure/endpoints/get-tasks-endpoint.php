<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure\Endpoints;

use Yoast\WP\SEO\Task_List\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Task_List\User_Interface\Tasks\Get_Tasks_Route;

/**
 * Represents the get tasks endpoint.
 */
class Get_Tasks_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'getTasks';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Get_Tasks_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Get_Tasks_Route::ROUTE_NAME;
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
