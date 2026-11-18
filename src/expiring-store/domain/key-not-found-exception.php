<?php

namespace Yoast\WP\SEO\Expiring_Store\Domain;

use RuntimeException;

/**
 * Exception for when a key is not found or has expired.
 */
class Key_Not_Found_Exception extends RuntimeException {
}
