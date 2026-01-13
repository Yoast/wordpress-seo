<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure\Endpoints;

use Yoast\WP\SEO\Task_List\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Task_List\User_Interface\Tasks\Manually_Complete_Task_Route;

/**
 * Represents the manually complete task endpoint.
 */
class Manually_Complete_Task_Endpoint implements Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'setTaskCompletion';
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public function get_namespace(): string {
		return Manually_Complete_Task_Route::ROUTE_NAMESPACE;
	}

	/**
	 * Gets the route.
	 *
	 * @return string
	 */
	public function get_route(): string {
		return Manually_Complete_Task_Route::ROUTE_NAME;
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
