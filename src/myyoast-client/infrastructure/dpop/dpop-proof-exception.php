<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP;

use RuntimeException;

/**
 * Exception thrown when DPoP proof generation fails.
 *
 * Wraps underlying crypto, signing, or random generation failures
 * into a single exception type for callers to handle.
 */
class DPoP_Proof_Exception extends RuntimeException {

}
