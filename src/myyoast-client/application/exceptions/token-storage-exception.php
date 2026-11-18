<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;

/**
 * Exception thrown when token storage or retrieval fails.
 *
 * Wraps underlying encryption failures into a storage-specific exception
 * so callers don't need to depend on crypto internals.
 */
class Token_Storage_Exception extends RuntimeException {

}
