<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;

/**
 * Exception thrown when client authentication (e.g. private_key_jwt assertion creation) fails.
 */
class Client_Authentication_Exception extends RuntimeException {

}
