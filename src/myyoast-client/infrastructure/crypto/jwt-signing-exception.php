<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use RuntimeException;

/**
 * Exception thrown when creating or signing a JWT fails.
 *
 * Covers failures producing the compact JWT serialization: JSON encoding
 * errors, libsodium signing errors, and random-bytes failures when
 * generating identifiers (jti).
 */
class JWT_Signing_Exception extends RuntimeException {

}
