<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;

/**
 * Distributed exclusive lock backed by the expiring store.
 *
 * Acquires a network-scoped lock in the expiring store table, executes the
 * callback, and releases the lock in a finally block.
 *
 * The lock has a TTL so that it self-expires if the owning process crashes without
 * releasing it. Other processes retry with a configurable delay between attempts.
 */
class Lock_Helper {

	/**
	 * The expiring store.
	 *
	 * @var Expiring_Store
	 */
	private $store;

	/**
	 * The constructor.
	 *
	 * @param Expiring_Store $store The expiring store.
	 */
	public function __construct( Expiring_Store $store ) {
		$this->store = $store;
	}

	/**
	 * Acquires a lock, executes the callback, and releases the lock.
	 *
	 * @template T
	 *
	 * @param string        $lock_key                 The lock key.
	 * @param callable(): T $callback                 The callback to execute while holding the lock.
	 * @param int           $ttl_in_seconds           The lock TTL in seconds. Defaults to 30.
	 * @param int           $max_attempts             The maximum number of acquisition attempts. Defaults to 5.
	 * @param int           $retry_delay_microseconds The delay between attempts in microseconds. Defaults to 20000 (20ms).
	 *
	 * @return T The callback's return value.
	 * @throws Lock_Timeout_Exception When the lock cannot be acquired within the allowed attempts.
	 */
	public function execute( string $lock_key, callable $callback, int $ttl_in_seconds = 30, int $max_attempts = 5, int $retry_delay_microseconds = 20_000 ) {
		$this->acquire( $lock_key, $ttl_in_seconds, $max_attempts, $retry_delay_microseconds );

		try {
			return $callback();
		}
		finally {
			$this->store->delete_for_multisite( $lock_key );
		}
	}

	/**
	 * Attempts to acquire the lock with retries.
	 *
	 * @param string $lock_key                 The lock key.
	 * @param int    $ttl_in_seconds           The lock TTL in seconds.
	 * @param int    $max_attempts             The maximum number of attempts.
	 * @param int    $retry_delay_microseconds The delay between attempts in microseconds.
	 *
	 * @return void
	 * @throws Lock_Timeout_Exception When all attempts are exhausted.
	 */
	private function acquire( string $lock_key, int $ttl_in_seconds, int $max_attempts, int $retry_delay_microseconds ): void {
		for ( $attempt = 1; $attempt <= $max_attempts; $attempt++ ) {
			if ( $this->store->persist_if_absent_for_multisite( $lock_key, true, $ttl_in_seconds ) ) {
				return;
			}

			if ( $attempt < $max_attempts ) {
				\usleep( $retry_delay_microseconds );
			}
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
		throw new Lock_Timeout_Exception( $lock_key, $max_attempts );
	}
}
