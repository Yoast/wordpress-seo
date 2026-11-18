<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use RuntimeException;

/**
 * Exception thrown when encryption or decryption operations fail.
 *
 * Covers missing sodium extension, corrupt encrypted data, or missing AUTH_KEY.
 */
class Encryption_Exception extends RuntimeException {

}
