<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the proxy for communicating with the database
 */
class WPSEO_Database_Proxy {

	/** @var string */
	protected $table_name;

	/** @var bool */
	protected $suppress_errors = true;

	/** @var bool */
	protected $last_suppressed_state;

	/** @var wpdb */
	protected $database;

	/**
	 * Sets the class attributes.
	 *
	 * @param wpdb   $database        The database object.
	 * @param string $table_name      The table name that is represented.
	 * @param bool   $suppress_errors Should the errors be suppressed.
	 */
	public function __construct( $database, $table_name, $suppress_errors = true ) {
		$this->table_name      = $table_name;
		$this->suppress_errors = (bool) $suppress_errors;
		$this->database        = $database;
	}

	/**
	 * Inserts data into the database.
	 *
	 * @param array $data   Data to insert.
	 * @param null  $format Formats for the data.
	 *
	 * @return false|int Total amount of inserted rows or false on error.
	 */
	public function insert( array $data, $format = null ) {
		$this->pre_execution();

		$result = $this->database->insert( $this->get_table_name(), $data, $format );

		$this->post_execution();

		return $result;
	}

	/**
	 * Updates data in the database.
	 *
	 * @param array $data         Data to update on the table.
	 * @param array $where        Where condition as key => value array.
	 * @param null  $format       Optional. data prepare format.
	 * @param null  $where_format Optional. Where prepare format.
	 *
	 * @return false|int False when the update request is invalid, int on number of rows changed.
	 */
	public function update( array $data, array $where, $format = null, $where_format = null ) {
		$this->pre_execution();

		$result = $this->database->update( $this->get_table_name(), $data, $where, $format, $where_format );

		$this->post_execution();

		return $result;
	}

	/**
	 * Upserts data in the database.
	 *
	 * Tries to insert the data first, if this fails an update is attempted.
	 *
	 * @param array $data         Data to update on the table.
	 * @param array $where        Where condition as key => value array.
	 * @param null  $format       Optional. data prepare format.
	 * @param null  $where_format Optional. Where prepare format.
	 *
	 * @return false|int False when the upsert request is invalid, int on number of rows changed.
	 */
	public function upsert( array $data, array $where, $format = null, $where_format = null ) {
		$result = $this->insert( $data, $format );

		if ( false === $result ) {
			$result = $this->update( $data, $where, $format, $where_format );
		}

		return $result;
	}

	/**
	 * Deletes a record from the database.
	 *
	 * @param array      $where  Where clauses for the query.
	 * @param null|array $format Formats for the data.
	 *
	 * @return false|int
	 */
	public function delete( array $where, $format = null ) {
		$this->pre_execution();

		$result = $this->database->delete( $this->get_table_name(), $where, $format );

		$this->post_execution();

		return $result;
	}

	/**
	 * Executes the given query and returns the results.
	 *
	 * @param string $query The query to execute.
	 *
	 * @return array|null|object The resultset
	 */
	public function get_results( $query ) {
		$this->pre_execution();

		$results = $this->database->get_results( $query );

		$this->post_execution();

		return $results;
	}

	/**
	 * Creates a table to the database.
	 *
	 * @param array $columns The columns to create.
	 * @param array $indexes The indexes to use.
	 *
	 * @return bool True when creation is successful.
	 */
	public function create_table( array $columns, array $indexes = array() ) {
		$create_table = sprintf( '
				CREATE TABLE IF NOT EXISTS %1$s ( %2$s ) %3$s',
			$this->get_table_name(),
			implode( ',', array_merge( $columns, $indexes ) ),
			$this->database->get_charset_collate()
		);

		$this->pre_execution();

		$is_created = (bool) $this->database->query( $create_table );

		$this->post_execution();

		return $is_created;
	}

	/**
	 * Checks if there is an error.
	 *
	 * @return bool Returns true when there is an error.
	 */
	public function has_error() {
		return ( $this->database->last_error !== '' );
	}

	/**
	 * Executed before a query will be ran.
	 */
	protected function pre_execution() {
		if ( $this->suppress_errors ) {
			$this->last_suppressed_state = $this->database->suppress_errors();
		}
	}

	/**
	 * Executed after a query has been ran.
	 */
	protected function post_execution() {
		if ( $this->suppress_errors ) {
			$this->database->suppress_errors( $this->last_suppressed_state );
		}
	}

	/**
	 * Returns the set table name.
	 *
	 * @return string
	 */
	protected function get_table_name() {
		return $this->table_name;
	}
}
