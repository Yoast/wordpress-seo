<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Endpoints;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Endpoints\Bulk_Editor_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository as Base_Endpoints_Repository;

/**
 * Repository for bulk editor endpoints.
 */
class Endpoints_Repository extends Base_Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Bulk_Editor_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Bulk_Editor_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
	}
}
