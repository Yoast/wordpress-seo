<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Exception;
use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * NullZeroObjectDates class.
 *
 * Replaces the zero dates stored in the indexable timestamp columns with NULL.
 */
class NullZeroObjectDates extends Migration {

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
	 * @throws Exception When the timestamps could not be cleaned.
	 */
	public function up() {
		$table_name = Model::get_table_name( 'Indexable' );
		$adapter    = $this->get_adapter();

		if ( ! $adapter->table_exists( $table_name ) ) {
			return;
		}

		// Reading the value as a string keeps this working when NO_ZERO_DATE
		// or NO_ZERO_IN_DATE is enabled. One statement for both columns: the
		// migration runs in a transaction, and a second full table scan would
		// hold the row locks much longer on a large indexable table.
		$published_zero     = $this->zero_month_or_day( 'object_published_at' );
		$last_modified_zero = $this->zero_month_or_day( 'object_last_modified' );

		$sql = 'UPDATE ' . $table_name
			. ' SET object_published_at = IF( ' . $published_zero . ', NULL, object_published_at ),'
			. ' object_last_modified = IF( ' . $last_modified_zero . ', NULL, object_last_modified )'
			. ' WHERE ' . $published_zero . ' OR ' . $last_modified_zero;

		$this->query_or_fail( $sql );
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
	 * Builds the condition that matches a date with a zero month or a zero day.
	 *
	 * @param string $column The column name.
	 *
	 * @return string The SQL condition.
	 */
	private function zero_month_or_day( $column ) {
		$column_string = 'CAST( ' . $column . ' AS CHAR )';

		// The month and day parts of a date are at position 6 and 9.
		return '( SUBSTRING( ' . $column_string . ', 6, 2 ) = \'00\''
			. ' OR SUBSTRING( ' . $column_string . ', 9, 2 ) = \'00\' )';
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
			throw new Exception( 'Could not clean the indexable timestamps.' );
		}
	}
}
