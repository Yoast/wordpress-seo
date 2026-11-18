<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Expiring_Store\Application\Ports;

/**
 * Port for the expiring store repository.
 */
interface Expiring_Store_Repository_Interface {

	/**
	 * Inserts or replaces a value in the expiring store.
	 *
	 * @param string $key                 The key to store.
	 * @param string $json_value          The JSON-encoded value.
	 * @param string $expiration_datetime The expiration datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return void
	 */
	public function upsert( string $key, string $json_value, string $expiration_datetime ): void;

	/**
	 * Finds a non-expired value by key.
	 *
	 * @param string $key              The key to find.
	 * @param string $current_datetime The current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return string|null The JSON-encoded value, or null if not found or expired.
	 */
	public function find( string $key, string $current_datetime ): ?string;

	/**
	 * Inserts a value only if the key does not already exist or has expired.
	 *
	 * @param string $key                 The key to store.
	 * @param string $json_value          The JSON-encoded value.
	 * @param string $expiration_datetime The expiration datetime in 'Y-m-d H:i:s' format.
	 * @param string $current_datetime    The current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return bool True if the value was inserted or an expired row was replaced, false if the key already exists and is not expired.
	 */
	public function insert_if_absent( string $key, string $json_value, string $expiration_datetime, string $current_datetime ): bool;

	/**
	 * Deletes a value by key.
	 *
	 * @param string $key The key to delete.
	 *
	 * @return void
	 */
	public function delete( string $key ): void;

	/**
	 * Deletes all expired entries.
	 *
	 * @param string $current_datetime The current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return int The number of deleted rows.
	 */
	public function delete_expired( string $current_datetime ): int;
}
