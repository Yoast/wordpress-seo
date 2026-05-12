<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;

/**
 * Exception thrown when an OIDC ID token fails validation.
 *
 * Covers structural issues (bad format, unsupported algorithm), signature
 * verification failures, and claim validation failures (issuer, audience,
 * expiration, nonce).
 */
class ID_Token_Validation_Exception extends RuntimeException {

}
