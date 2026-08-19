<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use RuntimeException;

/**
 * Exception thrown when JWT time-based claim validation fails.
 *
 * Covers expired tokens (exp), not-yet-valid tokens (nbf), and stale tokens (iat).
 */
class JWT_Validation_Exception extends RuntimeException {

}
