<?php

namespace Yoast\WP\SEO\Expiring_Store\Domain;

use RuntimeException;

/**
 * Exception for when a user-specific operation is attempted without a logged-in user.
 */
class No_Current_User_Exception extends RuntimeException {
}
