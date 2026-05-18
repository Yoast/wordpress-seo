<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Endpoints;

use Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Dashboard_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository as Base_Endpoints_Repository;

/**
 * Repository for endpoints.
 */
class Endpoints_Repository extends Base_Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Dashboard_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Dashboard_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
	}
}
