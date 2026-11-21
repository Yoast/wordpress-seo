<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use RuntimeException;

/**
 * Exception thrown when JWT signature verification fails.
 *
 * Covers invalid signatures, malformed JWTs, and tampered tokens.
 */
class JWT_Signature_Exception extends RuntimeException {

}
