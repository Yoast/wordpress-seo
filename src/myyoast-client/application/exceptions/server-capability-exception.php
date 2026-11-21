<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;

/**
 * Exception thrown when the authorization server doesn't advertise
 * support for features required by this client.
 *
 * This typically indicates the server has been downgraded or the
 * plugin needs to be updated.
 */
class Server_Capability_Exception extends RuntimeException {

}
