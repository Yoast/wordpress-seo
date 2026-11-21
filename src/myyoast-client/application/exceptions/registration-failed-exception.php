<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;

/**
 * Exception thrown when Dynamic Client Registration (RFC 7591) or
 * Registration Management (RFC 7592) operations fail.
 */
class Registration_Failed_Exception extends RuntimeException {

}
