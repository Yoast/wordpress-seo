<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Consent\Application;

use Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 *
 * @deprecated
 * @codeCoverageIgnore
 */
class Consent_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param Consent_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Consent_Endpoint_Interface ...$endpoints ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Consent\Application\Consent_Endpoints_Repository::__construct' );

		parent::__construct( ...$endpoints );
		$this->endpoints = $endpoints;
	}
}
