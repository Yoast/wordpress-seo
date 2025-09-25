<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Application;

use Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints\Generator_Endpoint_Interface;
use Yoast\WP\SEO\Routes\Endpoint\Endpoints_Repository;

/**
 * Repository for endpoints.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
class Generator_Endpoints_Repository extends Endpoints_Repository {

	/**
	 * Constructs the repository.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param Generator_Endpoint_Interface ...$endpoints The endpoints to add to the repository.
	 */
	public function __construct( Generator_Endpoint_Interface ...$endpoints ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Application\Generator_Endpoints_Repository::__construct' );

		parent::__construct( ...$endpoints );
	}
}
