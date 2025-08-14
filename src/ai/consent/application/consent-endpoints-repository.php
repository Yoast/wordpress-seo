<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Consent\Application;

use Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 */
class Consent_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @param Consent_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Consent_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
		$this->endpoints = $endpoints;
	}
}
