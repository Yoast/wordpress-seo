<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Endpoints\Management_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for the MyYoast management endpoints.
 */
class Management_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Management_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Management_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
	}
}
