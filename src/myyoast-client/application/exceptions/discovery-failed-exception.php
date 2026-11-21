<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;

/**
 * Exception thrown when OIDC discovery document retrieval fails.
 */
class Discovery_Failed_Exception extends RuntimeException {

}
