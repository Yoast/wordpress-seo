<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Endpoints\Content_Planner_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 */
class Content_Planner_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Content_Planner_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Content_Planner_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
	}
}
