<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Free_Sparks\Application;

use Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 *
 * @deprecated
 * @codeCoverageIgnore
 */
class Free_Sparks_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param Free_Sparks_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Free_Sparks_Endpoint_Interface ...$endpoints ) {

		parent::__construct( ...$endpoints );
		$this->endpoints = $endpoints;
	}
}
