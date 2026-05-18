<?php

namespace Yoast\WP\SEO\Expiring_Store\Infrastructure;

use Yoast\WP\SEO\Expiring_Store\Application\Ports\Expiring_Store_Repository_Interface;

/**
 * WPDB-backed repository for the expiring store table.
 *
 * Handles raw database queries against the network-wide yoast_expiring_store table.
 */
class WPDB_Expiring_Store_Repository implements Expiring_Store_Repository_Interface {

	/**
	 * Inserts or replaces a value in the expiring store.
	 *
	 * @param string $key                 The key to store.
	 * @param string $json_value          The JSON-encoded value.
	 * @param string $expiration_datetime The expiration datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return void
	 */
	public function upsert( string $key, string $json_value, string $expiration_datetime ): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom table with no caching layer.
		$wpdb->replace(
			$this->get_table_name(),
			[
				'key_name' => $key,
				'value'    => $json_value,
				'exp'      => $expiration_datetime,
			],
			[ '%s', '%s', '%s' ],
		);
	}

	/**
	 * Inserts a value only if the key does not already exist or has expired.
	 *
	 * First removes any expired row for this key, then attempts an INSERT IGNORE.
	 * The primary key constraint ensures that only one concurrent caller can win the insert.
	 * Both queries use standard SQL compatible with MySQL and SQLite (via the WP SQLite plugin).
	 *
	 * @param string $key                 The key to store.
	 * @param string $json_value          The JSON-encoded value.
	 * @param string $expiration_datetime The expiration datetime in 'Y-m-d H:i:s' format.
	 * @param string $current_datetime    The current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return bool True if the value was inserted, false if the key already exists and is not expired.
	 */
	public function insert_if_absent( string $key, string $json_value, string $expiration_datetime, string $current_datetime ): bool {
		global $wpdb;

		$table = $this->get_table_name();

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom table with no caching layer.

		// Remove the row only if it has expired. Non-expired rows are left untouched.
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM %i WHERE `key_name` = %s AND `exp` <= %s',
				$table,
				$key,
				$current_datetime,
			),
		);

		// Attempt to insert. INSERT IGNORE silently skips on duplicate key without triggering wpdb errors.
		$wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO %i (`key_name`, `value`, `exp`) VALUES (%s, %s, %s)',
				$table,
				$key,
				$json_value,
				$expiration_datetime,
			),
		);

		// phpcs:enable

		return $wpdb->rows_affected === 1;
	}

	/**
	 * Finds a non-expired value by key.
	 *
	 * @param string $key              The key to find.
	 * @param string $current_datetime The current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return string|null The JSON-encoded value, or null if not found or expired.
	 */
	public function find( string $key, string $current_datetime ): ?string {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom table with no caching layer.
		$result = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT `value` FROM %i WHERE `key_name` = %s AND `exp` > %s',
				$this->get_table_name(),
				$key,
				$current_datetime,
			),
		);

		return ( $result ?? null );
	}

	/**
	 * Deletes a value by key.
	 *
	 * @param string $key The key to delete.
	 *
	 * @return void
	 */
	public function delete( string $key ): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom table with no caching layer.
		$wpdb->delete(
			$this->get_table_name(),
			[ 'key_name' => $key ],
			[ '%s' ],
		);
	}

	/**
	 * Deletes all expired entries.
	 *
	 * @param string $current_datetime The current datetime in 'Y-m-d H:i:s' format.
	 *
	 * @return int The number of deleted rows.
	 */
	public function delete_expired( string $current_datetime ): int {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom table with no caching layer.
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM %i WHERE `exp` <= %s',
				$this->get_table_name(),
				$current_datetime,
			),
		);

		return $wpdb->rows_affected;
	}

	/**
	 * Returns the table name for the expiring store.
	 *
	 * Uses base_prefix so the table is shared across the entire multisite network.
	 *
	 * @return string The table name.
	 */
	private function get_table_name(): string {
		global $wpdb;

		return $wpdb->base_prefix . 'yoast_expiring_store';
	}
}
