<?php

namespace Yoast\WP\SEO\Expiring_Store\Application;

use InvalidArgumentException;
use JsonException;
use JsonSerializable;
use Yoast\WP\SEO\Expiring_Store\Application\Ports\Expiring_Store_Repository_Interface;
use Yoast\WP\SEO\Expiring_Store\Domain\Corrupted_Value_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\No_Current_User_Exception;
use Yoast\WP\SEO\Helpers\Date_Helper;

/**
 * Reliable temporary storage with expiration.
 *
 * Backed by a custom database table (one per multisite network) instead of transients,
 * ensuring values are not lost due to cache eviction or transient purging.
 *
 * ## When to use this
 *
 * Use Expiring_Store when losing a value before its TTL has real consequences:
 * - OAuth handshakes and short-lived tokens (e.g. PKCE code verifiers).
 * - Locks that prevent concurrent operations (e.g. token refresh race conditions).
 * - Any value where a missing entry causes user-facing errors or excessive API calls.
 *
 * ## When to use transients or wp_cache instead
 *
 * - **`wp_cache`**: For data that only needs to live within the current request, or that
 *   benefits from a persistent object cache but can be recomputed cheaply if lost.
 * - **Transients**: For data that is purely a performance optimization (caching). If the
 *   transient disappears, the worst case is a slower request while the value is recomputed.
 *   Never use transients for data whose loss would cause functional failures.
 *
 * ## Scoping strategies
 *
 * - **Blog-scoped** (`persist`, `get`, `delete`): Keys are prefixed with the current blog ID.
 *   Use for data that belongs to a specific site in a multisite network.
 * - **User-scoped** (`*_for_user`): Keys are prefixed with the given or current user ID.
 *   Use for per-user data like OAuth tokens or verification codes.
 *   Accepts an optional `$user_id`; when omitted (or 0), falls back to the current user.
 *   Throws {@see No_Current_User_Exception} when no user ID is given and no user is logged in.
 * - **Network-scoped** (`*_for_multisite`): Keys are stored as-is without any prefix.
 *   Use for data shared across all sites in the network.
 *
 * ## Behavior
 *
 * Values are JSON-encoded for storage (not PHP-serialized) to avoid object injection risks.
 * Any JSON-encodable value is accepted: scalars, arrays, or {@see \JsonSerializable} objects.
 *
 * If a key already exists, `persist` overwrites it (upsert behavior).
 * If a key is not found or has expired, `get` throws a {@see Key_Not_Found_Exception}.
 * If a key's value cannot be decoded from JSON, `get` throws a {@see Corrupted_Value_Exception}.
 *
 * Expired entries are cleaned up automatically by the hourly `wpseo_cleanup_cron` job
 * and can be triggered manually via `wp yoast cleanup`.
 */
class Expiring_Store {

	/**
	 * The repository for database operations.
	 *
	 * @var Expiring_Store_Repository_Interface
	 */
	private $repository;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	private $date_helper;

	/**
	 * The constructor.
	 *
	 * @param Expiring_Store_Repository_Interface $repository  The repository for database operations.
	 * @param Date_Helper                         $date_helper The date helper.
	 */
	public function __construct( Expiring_Store_Repository_Interface $repository, Date_Helper $date_helper ) {
		$this->repository  = $repository;
		$this->date_helper = $date_helper;
	}

	/**
	 * Persists a value scoped to the current blog.
	 *
	 * @param string                                                          $key            The key.
	 * @param scalar|array<string|int|float|bool|array|null>|JsonSerializable $value          The value to store.
	 * @param int                                                             $ttl_in_seconds The time-to-live in seconds.
	 *
	 * @return void
	 * @throws InvalidArgumentException When the value is not JSON-encodable.
	 */
	public function persist( string $key, $value, int $ttl_in_seconds ): void {
		$this->do_persist( $this->prefix_for_blog( $key ), $value, $ttl_in_seconds );
	}

	/**
	 * Persists a value scoped to a user.
	 *
	 * @param string                                                          $key            The key.
	 * @param scalar|array<string|int|float|bool|array|null>|JsonSerializable $value          The value to store.
	 * @param int                                                             $ttl_in_seconds The time-to-live in seconds.
	 * @param int                                                             $user_id        The user ID. Defaults to the current user.
	 *
	 * @return void
	 * @throws InvalidArgumentException  When the value is not JSON-encodable.
	 * @throws No_Current_User_Exception When no user ID is given and no user is logged in.
	 */
	public function persist_for_user( string $key, $value, int $ttl_in_seconds, int $user_id = 0 ): void {
		$this->do_persist( $this->prefix_for_user( $key, $user_id ), $value, $ttl_in_seconds );
	}

	/**
	 * Persists a value shared across the entire multisite network.
	 *
	 * @param string                                                          $key            The key.
	 * @param scalar|array<string|int|float|bool|array|null>|JsonSerializable $value          The value to store.
	 * @param int                                                             $ttl_in_seconds The time-to-live in seconds.
	 *
	 * @return void
	 * @throws InvalidArgumentException When the value is not JSON-encodable.
	 */
	public function persist_for_multisite( string $key, $value, int $ttl_in_seconds ): void {
		$this->do_persist( $key, $value, $ttl_in_seconds );
	}

	/**
	 * Gets a value scoped to the current blog.
	 *
	 * @param string $key The key.
	 *
	 * @return scalar|array<string|int|float|bool|array|null> The stored value.
	 * @throws Key_Not_Found_Exception   When the key is not found or has expired.
	 * @throws Corrupted_Value_Exception When the stored value cannot be decoded from JSON.
	 */
	public function get( string $key ) {
		return $this->do_get( $this->prefix_for_blog( $key ) );
	}

	/**
	 * Gets a value scoped to a user.
	 *
	 * @param string $key     The key.
	 * @param int    $user_id The user ID. Defaults to the current user.
	 *
	 * @return scalar|array<string|int|float|bool|array|null> The stored value.
	 * @throws Key_Not_Found_Exception    When the key is not found or has expired.
	 * @throws Corrupted_Value_Exception  When the stored value cannot be decoded from JSON.
	 * @throws No_Current_User_Exception  When no user ID is given and no user is logged in.
	 */
	public function get_for_user( string $key, int $user_id = 0 ) {
		return $this->do_get( $this->prefix_for_user( $key, $user_id ) );
	}

	/**
	 * Gets a value shared across the entire multisite network.
	 *
	 * @param string $key The key.
	 *
	 * @return scalar|array<string|int|float|bool|array|null> The stored value.
	 * @throws Key_Not_Found_Exception   When the key is not found or has expired.
	 * @throws Corrupted_Value_Exception When the stored value cannot be decoded from JSON.
	 */
	public function get_for_multisite( string $key ) {
		return $this->do_get( $key );
	}

	/**
	 * Checks whether a non-expired value exists for a blog-scoped key.
	 *
	 * @param string $key The key.
	 *
	 * @return bool
	 */
	public function has( string $key ): bool {
		return $this->do_has( $this->prefix_for_blog( $key ) );
	}

	/**
	 * Checks whether a non-expired value exists for a user-scoped key.
	 *
	 * @param string $key     The key.
	 * @param int    $user_id The user ID. Defaults to the current user.
	 *
	 * @return bool
	 * @throws No_Current_User_Exception When no user ID is given and no user is logged in.
	 */
	public function has_for_user( string $key, int $user_id = 0 ): bool {
		return $this->do_has( $this->prefix_for_user( $key, $user_id ) );
	}

	/**
	 * Checks whether a non-expired value exists for a multisite-scoped key.
	 *
	 * @param string $key The key.
	 *
	 * @return bool
	 */
	public function has_for_multisite( string $key ): bool {
		return $this->do_has( $key );
	}

	/**
	 * Deletes a value scoped to the current blog.
	 *
	 * @param string $key The key.
	 *
	 * @return void
	 */
	public function delete( string $key ): void {
		$this->repository->delete( $this->prefix_for_blog( $key ) );
	}

	/**
	 * Deletes a value scoped to a user.
	 *
	 * @param string $key     The key.
	 * @param int    $user_id The user ID. Defaults to the current user.
	 *
	 * @return void
	 * @throws No_Current_User_Exception When no user ID is given and no user is logged in.
	 */
	public function delete_for_user( string $key, int $user_id = 0 ): void {
		$this->repository->delete( $this->prefix_for_user( $key, $user_id ) );
	}

	/**
	 * Deletes a value shared across the entire multisite network.
	 *
	 * @param string $key The key.
	 *
	 * @return void
	 */
	public function delete_for_multisite( string $key ): void {
		$this->repository->delete( $key );
	}

	/**
	 * Cleans up all expired entries.
	 *
	 * @return int The number of deleted entries.
	 */
	public function cleanup_expired(): int {
		return $this->repository->delete_expired( $this->current_datetime() );
	}

	/**
	 * Persists a value with the given prefixed key.
	 *
	 * @param string                                                                         $prefixed_key   The prefixed key.
	 * @param string|int|float|bool|array<string|int|float|bool|array|null>|JsonSerializable $value          The value to store.
	 * @param int                                                                            $ttl_in_seconds The time-to-live in seconds.
	 *
	 * @return void
	 * @throws InvalidArgumentException When the value is not JSON-encodable.
	 */
	private function do_persist( string $prefixed_key, $value, int $ttl_in_seconds ): void {
		$json = $this->json_encode_value( $value );
		$exp  = \gmdate( 'Y-m-d H:i:s', ( $this->date_helper->current_time() + $ttl_in_seconds ) );

		$this->repository->upsert( $prefixed_key, $json, $exp );
	}

	/**
	 * Gets and decodes a value by prefixed key.
	 *
	 * @param string $prefixed_key The prefixed key.
	 *
	 * @return string|int|float|bool|array<string|int|float|bool|array|null> The stored value.
	 * @throws Key_Not_Found_Exception    When the key is not found or has expired.
	 * @throws Corrupted_Value_Exception When the stored value cannot be decoded from JSON.
	 */
	private function do_get( string $prefixed_key ) {
		$json = $this->repository->find( $prefixed_key, $this->current_datetime() );

		if ( $json === null ) {
			throw new Key_Not_Found_Exception( "Key '{$prefixed_key}' not found or expired." );
		}

		try {
			return \json_decode( $json, true, 512, \JSON_THROW_ON_ERROR );
		} catch ( JsonException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new Corrupted_Value_Exception( $prefixed_key, $e->getMessage() );
		}
	}

	/**
	 * Checks whether a non-expired value exists for the given prefixed key.
	 *
	 * @param string $prefixed_key The prefixed key.
	 *
	 * @return bool
	 */
	private function do_has( string $prefixed_key ): bool {
		return $this->repository->find( $prefixed_key, $this->current_datetime() ) !== null;
	}

	/**
	 * JSON-encodes a value.
	 *
	 * @param string|int|float|bool|array<string|int|float|bool|array|null>|JsonSerializable $value The value to encode.
	 *
	 * @return string The JSON-encoded value.
	 * @throws InvalidArgumentException When the value is not JSON-encodable.
	 */
	private function json_encode_value( $value ): string {
		// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- WPSEO_Utils::format_json_encode we don't intend to output this.
		$encoded = \wp_json_encode( $value );

		if ( $encoded === false ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
			throw new InvalidArgumentException( 'Expiring_Store: value must be JSON-encodable. ' . \json_last_error_msg() );
		}

		return $encoded;
	}

	/**
	 * Prefixes a key for blog scope.
	 *
	 * @param string $key The key.
	 *
	 * @return string The prefixed key.
	 */
	private function prefix_for_blog( string $key ): string {
		return 'blog_' . \get_current_blog_id() . ':' . $key;
	}

	/**
	 * Prefixes a key for user scope.
	 *
	 * @param string $key     The key.
	 * @param int    $user_id The user ID. When 0, falls back to the current user.
	 *
	 * @return string The prefixed key.
	 * @throws No_Current_User_Exception When no user ID is given and no user is logged in.
	 */
	private function prefix_for_user( string $key, int $user_id = 0 ): string {
		if ( $user_id <= 0 ) {
			$user_id = \get_current_user_id();
		}

		if ( $user_id === 0 ) {
			throw new No_Current_User_Exception( 'Cannot use user-scoped expiring store methods without a logged-in user.' );
		}

		return 'user_' . $user_id . ':' . $key;
	}

	/**
	 * Returns the current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return string The current datetime.
	 */
	private function current_datetime(): string {
		return \gmdate( 'Y-m-d H:i:s', $this->date_helper->current_time() );
	}
}
