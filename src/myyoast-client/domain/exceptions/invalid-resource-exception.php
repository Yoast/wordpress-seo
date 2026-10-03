<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Domain\Exceptions;

use InvalidArgumentException;

/**
 * Exception thrown when a resource indicator (RFC 8707) is malformed.
 *
 * Callers translate this into their flow-specific exception
 * (Authorization_Flow_Exception or Token_Request_Failed_Exception).
 */
class Invalid_Resource_Exception extends InvalidArgumentException {

}
