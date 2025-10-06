<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Consent\Application;

use Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 *
deprecated 26.3
 * @codeCoverageIgnore
 */
class Consent_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param Consent_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Consent_Endpoint_Interface ...$endpoints ) {
		parent::__construct( ...$endpoints );
		$this->endpoints = $endpoints;
	}
}
