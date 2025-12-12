<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure\Endpoints;

use Yoast\WP\SEO\Task_List\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Task_List\User_Interface\Tasks\Complete_Task_Route;

/**
 * Represents the complete task endpoint.
 */
class Complete_Task_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'completeTask';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Complete_Task_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Complete_Task_Route::ROUTE_NAME;
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
