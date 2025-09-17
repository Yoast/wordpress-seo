<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Application;

use Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints\Generator_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 */
class Generator_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Generator_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Generator_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
		$this->endpoints = $endpoints;
	}
}
