<?php
/**
 * Base migration class.
 *
 * @package Yoast\WP\Lib
 */

namespace Yoast\WP\Lib\Migrations;

/**
 * Migration class
 */
class Migration {

	/**
	 * The adapter.
	 *
	 * @var Adapter
	 */
	private $_adapter;

	/**
	 * __construct
	 *
	 * @param Adapter $adapter the current adapter.
	 *
	 * @return \Migration
	 */
	public function __construct( $adapter ) {
		$this->set_adapter( $adapter );
	}

	/**
	 * Set an adapter
	 *
	 * @param Adapter $adapter The adapter to set.
	 *
	 * @return $this
	 */
	public function set_adapter( $adapter ) {
		if ( ! $adapter instanceof Adapter ) {
			return;
		}
		$this->_adapter = $adapter;
		return $this;
	}

	/**
	 * Get the current adapter
	 *
	 * @return object
	 */
	public function get_adapter() {
		return $this->_adapter;
	}

	/**
	 * Create a database
	 *
	 * @param string $name    The name of the database.
	 * @param array  $options The options.
	 *
	 * @return boolean
	 */
	public function create_database( $name, $options = null ) {
		return $this->_adapter->create_database( $name, $options );
	}

	/**
	 * Drop a database
	 *
	 * @param string $name The name of the database.
	 *
	 * @return boolean
	 */
	public function drop_database( $name ) {
		return $this->_adapter->drop_database( $name );
	}

	/**
	 * Drop a table
	 *
	 * @param string $tbl The name of the table.
	 *
	 * @return boolean
	 */
	public function drop_table( $tbl ) {
		return $this->_adapter->drop_table( $tbl );
	}

	/**
	 * Rename a table
	 *
	 * @param string $name     The name of the table.
	 * @param string $new_name The new name of the table.
	 *
	 * @return boolean
	 */
	public function rename_table( $name, $new_name ) {
		return $this->_adapter->rename_table( $name, $new_name );
	}

	/**
	 * Rename a column
	 *
	 * @param string $tbl_name        The name of the table.
	 * @param string $column_name     The column name.
	 * @param string $new_column_name The new column name.
	 *
	 * @return boolean
	 */
	public function rename_column( $tbl_name, $column_name, $new_column_name ) {
		return $this->_adapter->rename_column( $tbl_name, $column_name, $new_column_name );
	}

	/**
	 * Add a column
	 *
	 * @param string       $table_name  The name of the table.
	 * @param string       $column_name The column name.
	 * @param string       $type        The column type.
	 * @param array|string $options     The options.
	 *
	 * @return boolean
	 */
	public function add_column( $table_name, $column_name, $type, $options = [] ) {
		return $this->_adapter->add_column( $table_name, $column_name, $type, $options );
	}

	/**
	 * Remove a column
	 *
	 * @param string $table_name  The name of the table.
	 * @param string $column_name The column name.
	 *
	 * @return boolean
	 */
	public function remove_column( $table_name, $column_name ) {
		return $this->_adapter->remove_column( $table_name, $column_name );
	}

	/**
	 * Change a column
	 *
	 * @param string       $table_name  The name of the table.
	 * @param string       $column_name The column name.
	 * @param string       $type        The column type.
	 * @param array|string $options     The options.
	 *
	 * @return boolean
	 */
	public function change_column( $table_name, $column_name, $type, $options = [] ) {
		return $this->_adapter->change_column( $table_name, $column_name, $type, $options );
	}

	/**
	 * Add an index
	 *
	 * @param string       $table_name  The name of the table.
	 * @param string       $column_name The column name.
	 * @param array|string $options     The options.
	 *
	 * @return boolean
	 */
	public function add_index( $table_name, $column_name, $options = [] ) {
		return $this->_adapter->add_index( $table_name, $column_name, $options );
	}

	/**
	 * Remove an index
	 *
	 * @param string       $table_name  The name of the table.
	 * @param string       $column_name The column name.
	 * @param array|string $options     The options.
	 *
	 * @return boolean
	 */
	public function remove_index( $table_name, $column_name, $options = [] ) {
		return $this->_adapter->remove_index( $table_name, $column_name, $options );
	}

	/**
	 * Add timestamps
	 *
	 * @param string $table_name          The name of the table.
	 * @param string $created_column_name Created at column name.
	 * @param string $updated_column_name Updated at column name.
	 *
	 * @return boolean
	 */
	public function add_timestamps( $table_name, $created_column_name = 'created_at', $updated_column_name = 'updated_at' ) {
		return $this->_adapter->add_timestamps( $table_name, $created_column_name, $updated_column_name );
	}

	/**
	 * Remove timestamps
	 *
	 * @param string $table_name          The name of the table.
	 * @param string $created_column_name Created at column name.
	 * @param string $updated_column_name Updated at column name.
	 *
	 * @return boolean
	 */
	public function remove_timestamps( $table_name, $created_column_name = 'created_at', $updated_column_name = 'updated_at' ) {
		return $this->_adapter->remove_timestamps( $table_name, $created_column_name, $updated_column_name );
	}

	/**
	 * Create a table
	 *
	 * @param string       $table_name The name of the table.
	 * @param array|string $options    The options.
	 *
	 * @return bool|Ruckusing_Adapter_MySQL_TableDefinition|Ruckusing_Adapter_PgSQL_TableDefinition|Ruckusing_Adapter_Sqlite3_TableDefinition
	 */
	public function create_table( $table_name, $options = [] ) {
		return $this->_adapter->create_table( $table_name, $options );
	}

	/**
	 * Select one query
	 *
	 * @param string $sql The query to run.
	 *
	 * @return array
	 */
	public function select_one( $sql ) {
		return $this->_adapter->select_one( $sql );
	}

	/**
	 * Select all query
	 *
	 * @param string $sql The query to run.
	 *
	 * @return array
	 */
	public function select_all( $sql ) {
		return $this->_adapter->select_all( $sql );
	}
	/**
	 * Execute a query
	 *
	 * @param string $sql The query to run.
	 *
	 * @return boolean
	 */
	public function query( $sql ) {
		return $this->_adapter->query( $sql );
	}
	/**
	 * Quote a string
	 *
	 * @param string $str The string to quote.
	 *
	 * @return string
	 */
	public function quote_string( $str ) {
		return $this->_adapter->quote_string( $str );
	}
}
