<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Endpoints;

use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository as Base_Endpoints_Repository;
use Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Task_List_Endpoint_Interface;

/**
 * Repository for endpoints.
 */
class Endpoints_Repository extends Base_Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Task_List_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Task_List_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
	}
}
