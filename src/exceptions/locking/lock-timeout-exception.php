<?php

namespace Yoast\WP\SEO\Exceptions\Locking;

use RuntimeException;

/**
 * Exception for when a lock cannot be acquired within the allowed number of attempts.
 */
class Lock_Timeout_Exception extends RuntimeException {

	/**
	 * The constructor.
	 *
	 * @param string $lock_key The lock key that could not be acquired.
	 * @param int    $attempts The number of attempts made.
	 */
	public function __construct( string $lock_key, int $attempts ) {
		parent::__construct( "Failed to acquire lock '{$lock_key}' after {$attempts} attempts." );
	}
}
