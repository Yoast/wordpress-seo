<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface;
use Yoast\WP\SEO\Actions\Indexing\Limited_Indexing_Action_Interface;

/**
 * Importing action interface.
 */
abstract class Abstract_Importing_Action implements Importing_Action_Interface {

	/**
	 * The plugin the class deals with.
	 *
	 * @var string
	 */
	const PLUGIN = null;

	/**
	 * The type the class deals with.
	 *
	 * @var string
	 */
	const TYPE = null;

	/**
	 * The name of the plugin we import from.
	 *
	 * @return string The plugin we import from.
	 */
	public function get_plugin() {
		$class = get_class( $this );
		return $class::PLUGIN;
	}

	/**
	 * The data type we import from the plugin.
	 *
	 * @return string The data type we import from the plugin.
	 */
	public function get_type() {
		$class = get_class( $this );
		return $class::TYPE;
	}

	/**
	 * Gets the cursor id.
	 *
	 * @return string The cursor id.
	 */
	protected function get_cursor_id() {
		$class = get_class( $this );
		return $class::PLUGIN . '_' . $class::TYPE;
	}

	/**
	 * Check if table exists.
	 *
	 * @param wpdb $wpdb The wpdb instance.
	 *
	 * @return bool Whether the table exists.
	 */
	protected function table_exists( $wpdb ) {
		$table = $this->get_table();

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$table_exists = $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" );
		if ( is_wp_error( $table_exists ) || is_null( $table_exists ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieves the table name along with the db prefix.
	 *
	 * @return string The table name along with the db prefix.
	 */
	abstract protected function get_table();

	/**
	 * Creates a query for gathering to-be-imported data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	abstract public function query();
}
