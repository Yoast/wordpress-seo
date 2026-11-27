<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Exception;
use Yoast\WP\Lib\Migrations\Adapter;
use Yoast\WP\Lib\Migrations\Migration;

/**
 * ConvertExpiringStoreTableCharset class.
 *
 * Aligns the expiring store table with the character set and collation of the site,
 * like the other Yoast tables.
 */
class ConvertExpiringStoreTableCharset extends Migration {

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * Migration up.
	 *
	 * @return void
	 *
	 * @throws Exception When the table could not be converted.
	 */
	public function up() {
		global $wpdb;

		$table_name = $this->get_table_name();
		$adapter    = $this->get_adapter();

		if ( ! $adapter->table_exists( $table_name ) ) {
			return;
		}

		$charset_collate = $wpdb->get_charset_collate();
		if ( empty( $charset_collate ) ) {
			return;
		}

		// The table is shared by the whole network, so a subsite that replays the
		// migrations has nothing to do once another site converted it.
		if ( $this->is_converted( $adapter, $table_name ) ) {
			return;
		}

		$charset_collate = \str_replace( 'DEFAULT ', '', $charset_collate );

		// Shorten the primary key first: varchar(255) with utf8mb4 exceeds the index
		// length limit of older row formats.
		$this->query_or_fail( 'ALTER TABLE ' . $table_name . ' MODIFY key_name varchar(191) NOT NULL' );
		$this->query_or_fail( 'ALTER TABLE ' . $table_name . ' CONVERT TO ' . $charset_collate );
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		// No down required.
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * Uses base_prefix so the table is shared across the entire multisite network.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		global $wpdb;

		return $wpdb->base_prefix . 'yoast_expiring_store';
	}

	/**
	 * Checks whether the table already uses the site character set and the shortened key.
	 *
	 * @param Adapter $adapter    The migrations adapter.
	 * @param string  $table_name The table name.
	 *
	 * @return bool Whether the table is already converted.
	 */
	private function is_converted( $adapter, $table_name ) {
		global $wpdb;

		$column = (array) $adapter->column_info( $table_name, 'key_name' );
		$column = \array_change_key_case( $column, \CASE_LOWER );

		if ( ! isset( $column['collation'], $column['type'] ) ) {
			return false;
		}

		if ( $column['type'] !== 'varchar(191)' ) {
			return false;
		}

		// When WordPress knows the site collation, the column has to match it
		// exactly. Otherwise any collation of the site character set will do.
		if ( ! empty( $wpdb->collate ) ) {
			return $column['collation'] === $wpdb->collate;
		}

		return \strpos( $column['collation'], $wpdb->charset . '_' ) === 0;
	}

	/**
	 * Runs a query and throws when it fails, so a failure is not recorded as a success.
	 *
	 * @param string $sql The query to run.
	 *
	 * @return void
	 *
	 * @throws Exception When the query fails.
	 */
	private function query_or_fail( $sql ) {
		if ( $this->query( $sql ) === false ) {
			throw new Exception( 'Could not convert the expiring store table.' );
		}
	}
}
