<?php
/**
 * Yoast model class.
 *
 * @package Yoast\WP\Lib
 */

namespace Yoast\WP\Lib;

use YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition;
use YoastSEO_Vendor\Ruckusing_Adapter_Interface;
use YoastSEO_Vendor\Ruckusing_Adapter_MySQL_Base;
use YoastSEO_Vendor\Ruckusing_Adapter_MySQL_TableDefinition;
use YoastSEO_Vendor\Ruckusing_Exception;
use YoastSEO_Vendor\Ruckusing_Util_Naming;

use const YoastSEO_Vendor\MYSQL_MAX_IDENTIFIER_LENGTH;
use const YoastSEO_Vendor\SQL_ALTER;
use const YoastSEO_Vendor\SQL_CREATE;
use const YoastSEO_Vendor\SQL_DELETE;
use const YoastSEO_Vendor\SQL_DROP;
use const YoastSEO_Vendor\SQL_INSERT;
use const YoastSEO_Vendor\SQL_RENAME;
use const YoastSEO_Vendor\SQL_SELECT;
use const YoastSEO_Vendor\SQL_SET;
use const YoastSEO_Vendor\SQL_SHOW;
use const YoastSEO_Vendor\SQL_UNKNOWN_QUERY_TYPE;
use const YoastSEO_Vendor\SQL_UPDATE;

/**
 * Class Ruckusing_Adapter.
 */
class Ruckusing_Adapter extends Ruckusing_Adapter_MySQL_Base implements Ruckusing_Adapter_Interface {

	/**
	 * Holds the name of this adapter.
	 *
	 * @var string
	 */
	private $_name = 'MySQL';

	/**
	 * Holds the tables.
	 *
	 * @var array
	 */
	private $_tables = [];

	/**
	 * Holds the tables_loaded.
	 *
	 * @var boolean
	 */
	private $_tables_loaded = false;

	/**
	 * Holds the version.
	 *
	 * @var string
	 */
	private $_version = '1.0';

	/**
	 * Indicates if is in transaction.
	 *
	 * @var boolean
	 */
	private $_in_trx = false;

	/**
	 * Creates an instance of Ruckusing_Adapter.
	 *
	 * @param array $config The configuration.
	 */
	public function __construct( $config ) {
		$this->set_dsn( $config );
	}

	/**
	 * Gets the current database name.
	 *
	 * @return string
	 */
	public function get_database_name() {
		global $wpdb;

		return $wpdb->dbname;
	}

	/**
	 * Checks the support for migrations.
	 *
	 * @return boolean
	 */
	public function supports_migrations() {
		return true;
	}

	/**
	 * Returns the column native types.
	 *
	 * @return array
	 */
	public function native_database_types() {
		$types = [
			'primary_key'   => [ 'name' => 'integer', 'limit' => 11, 'null' => false ],
			'string'        => [ 'name' => 'varchar', 'limit' => 255 ],
			'text'          => [ 'name' => 'text' ],
			'tinytext'      => [ 'name' => 'tinytext' ],
			'mediumtext'    => [ 'name' => 'mediumtext' ],
			'integer'       => [ 'name' => 'int', 'limit' => 11 ],
			'tinyinteger'   => [ 'name' => 'tinyint' ],
			'smallinteger'  => [ 'name' => 'smallint' ],
			'mediuminteger' => [ 'name' => 'mediumint' ],
			'biginteger'    => [ 'name' => 'bigint' ],
			'float'         => [ 'name' => 'float' ],
			'decimal'       => [ 'name' => 'decimal', 'scale' => 0, 'precision' => 10 ],
			'datetime'      => [ 'name' => 'datetime' ],
			'timestamp'     => [ 'name' => 'timestamp' ],
			'time'          => [ 'name' => 'time' ],
			'date'          => [ 'name' => 'date' ],
			'binary'        => [ 'name' => 'blob' ],
			'tinybinary'    => [ 'name' => 'tinyblob' ],
			'mediumbinary'  => [ 'name' => 'mediumblob' ],
			'longbinary'    => [ 'name' => 'longblob' ],
			'boolean'       => [ 'name' => 'tinyint', 'limit' => 1 ],
			'enum'          => [ 'name' => 'enum', 'values' => [] ],
			'uuid'          => [ 'name' => 'char', 'limit' => 36 ],
			'char'          => [ 'name' => 'char' ],
		];

		return $types;
	}

	/**
	 * Creates the schema table, if necessary.
	 *
	 * @throws Ruckusing_Exception Invalid MySQL Adapter instance.
	 * @throws Ruckusing_Exception Invalid 'name' parameter.
	 * @throws Ruckusing_Exception Invalid Adapter instance.
	 * @throws Ruckusing_Exception Invalid 'type' parameter.
	 * @throws Ruckusing_Exception Table Definition: '%s' has not been initialized.
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing column name parameter.
	 * @throws Ruckusing_Exception The auto-generated index name is too long for MySQL (max is 64 chars).
	 */
	public function create_schema_version_table() {
		if ( ! $this->has_table( $this->get_schema_version_table_name() ) ) {
			$t = $this->create_table( $this->get_schema_version_table_name(), [ 'id' => false ] );
			$t->column( 'version', 'string' );
			$t->finish();
			$this->add_index( $this->get_schema_version_table_name(), 'version', [ 'unique' => true ] );
		}
	}

	/**
	 * Start a transaction.
	 *
	 * @throws Ruckusing_Exception Transaction already started.
	 */
	public function start_transaction() {
		if ( $this->inTransaction() === false ) {
			$this->beginTransaction();
		}
	}

	/**
	 * Commits a transaction.
	 *
	 * @throws Ruckusing_Exception Transaction not started.
	 */
	public function commit_transaction() {
		if ( $this->inTransaction() ) {
			$this->commit();
		}
	}

	/**
	 * Rolls back a transaction.
	 *
	 * @throws Ruckusing_Exception Transaction not started.
	 */
	public function rollback_transaction() {
		if ( $this->inTransaction() ) {
			$this->rollback();
		}
	}

	/**
	 * Quotes a table name string.
	 *
	 * @param string $str The table name.
	 *
	 * @return string
	 */
	public function quote_table( $str ) {
		return '`' . $str . '`';
	}

	/**
	 * Retrieves a column definition.
	 *
	 * @param string $column_name The column name.
	 * @param string $type        The type of the column.
	 * @param array  $options     Column options.
	 *
	 * @throws Ruckusing_Exception Invalid Adapter instance.
	 * @throws Ruckusing_Exception Invalid 'name' parameter.
	 * @throws Ruckusing_Exception Invalid 'type' parameter.
	 *
	 * @return string
	 */
	public function column_definition( $column_name, $type, $options = null ) {
		$col = new Ruckusing_Adapter_ColumnDefinition( $this, $column_name, $type, $options );

		return $col->__toString();
	}

	// -----------------------------------
	// DATABASE LEVEL OPERATIONS
	// -----------------------------------
	/**
	 * Checks if a database exists.
	 *
	 * @param string $db The database name.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return boolean
	 */
	public function database_exists( $db ) {
		$ddl    = 'SHOW DATABASES';
		$result = $this->select_all( $ddl );
		if ( \count( $result ) === 0 ) {
			return false;
		}
		foreach ( $result as $dbrow ) {
			if ( $dbrow['Database'] === $db ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Creates a database.
	 *
	 * @param string $db The db name.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return boolean
	 */
	public function create_database( $db ) {
		if ( $this->database_exists( $db ) ) {
			return false;
		}
		$ddl    = \sprintf( 'CREATE DATABASE %s', $this->identifier( $db ) );
		$result = $this->query( $ddl );

		return $result === true;
	}

	/**
	 * Drops a database.
	 *
	 * @param string $db The db name.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return boolean
	 */
	public function drop_database( $db ) {
		if ( ! $this->database_exists( $db ) ) {
			return false;
		}
		$ddl    = \sprintf( 'DROP DATABASE IF EXISTS %s', $this->identifier( $db ) );
		$result = $this->query( $ddl );

		return $result === true;
	}

	/**
	 * Dumps the complete schema of the DB.
	 *
	 * This is really just all of the CREATE TABLE statements for all of the tables in the DB.
	 * NOTE: this does NOT include any INSERT statements or the actual data (that is, this method is NOT a replacement for mysqldump).
	 *
	 * @param string $output_file The filepath to output to.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return int|false The number of written bytes or false on failure.
	 */
	public function schema( $output_file ) {
		$final = '';
		$views = '';
		$this->load_tables( true );
		foreach ( $this->_tables as $tbl => $idx ) {
			if ( $tbl === 'schema_info' ) {
				continue;
			}
			$stmt   = \sprintf( 'SHOW CREATE TABLE %s', $this->identifier( $tbl ) );
			$result = $this->query( $stmt );
			if ( \is_array( $result ) && \count( $result ) === 1 ) {
				$row = $result[0];
				if ( \count( $row ) === 2 ) {
					if ( isset( $row['Create Table'] ) ) {
						$final .= $row['Create Table'] . ";\n\n";
					}
					elseif ( isset( $row['Create View'] ) ) {
						$views .= $row['Create View'] . ";\n\n";
					}
				}
			}
		}
		$data = $final . $views;

		return \file_put_contents( $output_file, $data, \LOCK_EX );
	}

	/**
	 * Checks if a table exists.
	 *
	 * @param string  $tbl           The table name.
	 * @param boolean $reload_tables Reload table or not.
	 *
	 * @return boolean
	 */
	public function table_exists( $tbl, $reload_tables = false ) {
		global $wpdb;

		// We need last error to be clear so we can check against it easily.
		$previous_last_error      = $wpdb->last_error;
		$previous_suppress_errors = $wpdb->suppress_errors;
		$wpdb->last_error         = '';
		$wpdb->suppress_errors    = true;

		$result = $wpdb->query( "SELECT * FROM $tbl LIMIT 1" );

		// Restore the last error, as this is not truly an error and we don't want to alarm people.
		$wpdb->last_error      = $previous_last_error;
		$wpdb->suppress_errors = $previous_suppress_errors;

		return $result !== false;
	}

	/**
	 * Executes a query.
	 *
	 * @param string $query Query to run.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return boolean
	 */
	public function execute( $query ) {
		return $this->query( $query );
	}

	/**
	 * Executes a query.
	 *
	 * @param string $query Query to run.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return boolean
	 */
	public function query( $query ) {
		global $wpdb;

		$query_type = $this->determine_query_type( $query );
		$data       = [];
		if ( $query_type === SQL_SELECT || $query_type === SQL_SHOW ) {
			$data = $wpdb->get_results( $query, ARRAY_A );
			if ( $this->isError( $data ) ) {
				throw new Ruckusing_Exception( \sprintf( "Error executing 'query' with:\n%s\n\nReason: %s\n\n", $query, $wpdb->last_error ), Ruckusing_Exception::QUERY_ERROR );
			}

			return $data;
		}
		else {
			// INSERT, DELETE, etc...
			$res = $wpdb->query( $query );
			if ( $this->isError( $res ) ) {
				throw new Ruckusing_Exception( \sprintf( "Error executing 'query' with:\n%s\n\nReason: %s\n\n", $query, $wpdb->last_error ), Ruckusing_Exception::QUERY_ERROR );
			}
			if ( $query_type === SQL_INSERT ) {
				return $wpdb->insert_id;
			}

			return true;
		}
	}

	/**
	 * Executes several queries.
	 *
	 * @param string $queries Queries to run.
	 *
	 * @throws Ruckusing_Exception WPDB does not support multi_query.
	 *
	 * @return boolean
	 */
	public function multi_query( $queries ) {
		if ( \defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT !== 'production' ) {
			throw new Ruckusing_Exception( 'WPDB does not support multi_query.', Ruckusing_Exception::QUERY_ERROR );
		}

		return false;
	}

	/**
	 * Select one.
	 *
	 * @param string $query Query to run.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 * @throws Ruckusing_Exception Query for select_one() is not one of SELECT or SHOW.
	 *
	 * @return array
	 */
	public function select_one( $query ) {
		global $wpdb;

		$query_type = $this->determine_query_type( $query );
		if ( $query_type === SQL_SELECT || $query_type === SQL_SHOW ) {
			$res = $wpdb->query( $query );
			if ( $this->isError( $res ) ) {
				throw new Ruckusing_Exception( \sprintf( "Error executing 'query' with:\n%s\n\nReason: %s\n\n", $query, $wpdb->last_error ), Ruckusing_Exception::QUERY_ERROR );
			}

			return $wpdb->last_result;
		}
		else {
			throw new Ruckusing_Exception( "Query for select_one() is not one of SELECT or SHOW: {$query}", Ruckusing_Exception::QUERY_ERROR );
		}
	}

	/**
	 * Select all.
	 *
	 * @param string $query Query to run.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return array|int|true Data for a Select or Show query. The ID for an Insert query. True for other queries.
	 */
	public function select_all( $query ) {
		return $this->query( $query );
	}

	/**
	 * Use this method for non-SELECT queries.
	 * Or anything where you dont necessarily expect a result string, e.g. DROPs, CREATEs, etc.
	 *
	 * @param string $ddl Query to run.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return true
	 */
	public function execute_ddl( $ddl ) {
		$this->query( $ddl );

		return true;
	}

	/**
	 * Drops a table.
	 *
	 * @param string $tbl The table name.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 *
	 * @return true
	 */
	public function drop_table( $tbl ) {
		$ddl    = \sprintf( 'DROP TABLE IF EXISTS %s', $this->identifier( $tbl ) );
		$this->query( $ddl );

		return true;
	}

	/**
	 * Creates a table.
	 *
	 * @param string $table_name The table name.
	 * @param array  $options    The options.
	 *
	 * @throws Ruckusing_Exception Invalid MySQL Adapter instance.
	 * @throws Ruckusing_Exception Invalid 'name' parameter.
	 *
	 * @return bool|Ruckusing_Adapter_MySQL_TableDefinition
	 */
	public function create_table( $table_name, $options = [] ) {
		return new Ruckusing_Adapter_MySQL_TableDefinition( $this, $table_name, $options );
	}

	/**
	 * Escapes a string for mysql.
	 *
	 * @param string $str The string.
	 *
	 * @return string
	 */
	public function quote_string( $str ) {
		global $wpdb;

		return $wpdb->_escape( $str );
	}

	/**
	 * Quotes a string.
	 *
	 * @param string $str The string.
	 *
	 * @return string
	 */
	public function identifier( $str ) {
		return '`' . $str . '`';
	}

	/**
	 * Quotes a string.
	 *
	 * @param string $value  The string.
	 * @param string $column The column.
	 *
	 * @return string
	 */
	public function quote( $value, $column = null ) {
		return $this->quote_string( $value );
	}

	/**
	 * Renames a table.
	 *
	 * @param string $name     The current table name.
	 * @param string $new_name The new table name.
	 *
	 * @throws Ruckusing_Exception Missing original column name parameter.
	 * @throws Ruckusing_Exception Missing new column name parameter.
	 *
	 * @return boolean
	 */
	public function rename_table( $name, $new_name ) {
		if ( empty( $name ) ) {
			throw new Ruckusing_Exception( 'Missing original column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $new_name ) ) {
			throw new Ruckusing_Exception( 'Missing new column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		$sql = \sprintf( 'RENAME TABLE %s TO %s', $this->identifier( $name ), $this->identifier( $new_name ) );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Adds a column.
	 *
	 * @param string $table_name  The table name.
	 * @param string $column_name The column name.
	 * @param string $type        The column type.
	 * @param array  $options     Column options.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing original column name parameter.
	 * @throws Ruckusing_Exception Missing type parameter.
	 *
	 * @return boolean
	 */
	public function add_column( $table_name, $column_name, $type, $options = [] ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column_name ) ) {
			throw new Ruckusing_Exception( 'Missing column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $type ) ) {
			throw new Ruckusing_Exception( 'Missing type parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		// Default types.
		if ( ! \array_key_exists( 'limit', $options ) ) {
			$options['limit'] = null;
		}
		if ( ! \array_key_exists( 'precision', $options ) ) {
			$options['precision'] = null;
		}
		if ( ! \array_key_exists( 'scale', $options ) ) {
			$options['scale'] = null;
		}
		$sql = \sprintf( 'ALTER TABLE %s ADD `%s` %s', $this->identifier( $table_name ), $column_name, $this->type_to_sql( $type, $options ) );
		$sql .= $this->add_column_options( $type, $options );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Drops a column.
	 *
	 * @param string $table_name  The table name.
	 * @param string $column_name The column name.
	 *
	 * @return boolean
	 */
	public function remove_column( $table_name, $column_name ) {
		$sql = \sprintf( 'ALTER TABLE %s DROP COLUMN %s', $this->identifier( $table_name ), $this->identifier( $column_name ) );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Renames a column.
	 *
	 * @param string $table_name      The table name.
	 * @param string $column_name     The column name.
	 * @param string $new_column_name The new column name.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing original column name parameter.
	 * @throws Ruckusing_Exception Missing new column name parameter.
	 *
	 * @return boolean
	 */
	public function rename_column( $table_name, $column_name, $new_column_name ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column_name ) ) {
			throw new Ruckusing_Exception( 'Missing original column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $new_column_name ) ) {
			throw new Ruckusing_Exception( 'Missing new column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		$column_info  = $this->column_info( $table_name, $column_name );
		$current_type = $column_info['type'];
		$sql          = \sprintf( 'ALTER TABLE %s CHANGE %s %s %s', $this->identifier( $table_name ), $this->identifier( $column_name ), $this->identifier( $new_column_name ), $current_type );
		$sql          .= $this->add_column_options( $current_type, $column_info );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Changes a column.
	 *
	 * @param string $table_name  The table name.
	 * @param string $column_name The column name.
	 * @param string $type        The column type.
	 * @param array  $options     Column options.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing original column name parameter.
	 * @throws Ruckusing_Exception Missing type parameter.
	 *
	 * @return boolean
	 */
	public function change_column( $table_name, $column_name, $type, $options = [] ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column_name ) ) {
			throw new Ruckusing_Exception( 'Missing original column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $type ) ) {
			throw new Ruckusing_Exception( 'Missing type parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		// Default types.
		if ( ! \array_key_exists( 'limit', $options ) ) {
			$options['limit'] = null;
		}
		if ( ! \array_key_exists( 'precision', $options ) ) {
			$options['precision'] = null;
		}
		if ( ! \array_key_exists( 'scale', $options ) ) {
			$options['scale'] = null;
		}
		$sql = \sprintf( 'ALTER TABLE `%s` CHANGE `%s` `%s` %s', $table_name, $column_name, $column_name, $this->type_to_sql( $type, $options ) );
		$sql .= $this->add_column_options( $type, $options );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Retrieves the column info.
	 *
	 * @param string $table  The table name.
	 * @param string $column The column name.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing original column name parameter.
	 *
	 * @return array
	 */
	public function column_info( $table, $column ) {
		if ( empty( $table ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column ) ) {
			throw new Ruckusing_Exception( 'Missing original column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		try {
			$sql    = \sprintf( "SHOW FULL COLUMNS FROM %s LIKE '%s'", $this->identifier( $table ), $column );
			$result = $this->select_one( $sql );
			if ( \is_array( $result ) ) {
				// Lowercase key names.
				$result = \array_change_key_case( $result, \CASE_LOWER );
			}

			return $result;
		} catch ( \Exception $e ) {
			return null;
		}
	}

	/**
	 * Add an index
	 *
	 * @param string $table_name  The table name.
	 * @param string $column_name The column name.
	 * @param array  $options     Index options.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing column name parameter.
	 * @throws Ruckusing_Exception The auto-generated index name is too long for MySQL (max is 64 chars).
	 *
	 * @return boolean
	 */
	public function add_index( $table_name, $column_name, $options = [] ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column_name ) ) {
			throw new Ruckusing_Exception( 'Missing column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		// Unique index?
		if ( \is_array( $options ) && \array_key_exists( 'unique', $options ) && $options['unique'] === true ) {
			$unique = true;
		}
		else {
			$unique = false;
		}
		// Did the user specify an index name?
		if ( \is_array( $options ) && \array_key_exists( 'name', $options ) ) {
			$index_name = $options['name'];
		}
		else {
			$index_name = Ruckusing_Util_Naming::index_name( $table_name, $column_name );
		}
		if ( \strlen( $index_name ) > MYSQL_MAX_IDENTIFIER_LENGTH ) {
			$msg = 'The auto-generated index name is too long for MySQL (max is 64 chars). ';
			$msg .= "Considering using 'name' option parameter to specify a custom name for this index.";
			$msg .= ' Note: you will also need to specify';
			$msg .= ' this custom name in a drop_index() - if you have one.';
			throw new Ruckusing_Exception( $msg, Ruckusing_Exception::INVALID_INDEX_NAME );
		}
		if ( ! \is_array( $column_name ) ) {
			$column_names = [ $column_name ];
		}
		else {
			$column_names = $column_name;
		}
		$cols = [];
		foreach ( $column_names as $name ) {
			$cols[] = $this->identifier( $name );
		}
		$sql = \sprintf(
			'CREATE %sINDEX %s ON %s(%s)',
			( $unique ) ? 'UNIQUE ' : '', $this->identifier( $index_name ),
			$this->identifier( $table_name ), \join( ', ', $cols )
		);

		return $this->execute_ddl( $sql );
	}

	/**
	 * Drops an index.
	 *
	 * @param string $table_name  The table name.
	 * @param string $column_name The column name.
	 * @param array  $options     Index options.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing column name parameter.
	 *
	 * @return boolean
	 */
	public function remove_index( $table_name, $column_name, $options = [] ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column_name ) ) {
			throw new Ruckusing_Exception( 'Missing column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		// Did the user specify an index name?
		if ( \is_array( $options ) && \array_key_exists( 'name', $options ) ) {
			$index_name = $options['name'];
		}
		else {
			$index_name = Ruckusing_Util_Naming::index_name( $table_name, $column_name );
		}
		$sql = \sprintf( 'DROP INDEX %s ON %s', $this->identifier( $index_name ), $this->identifier( $table_name ) );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Adds timestamps.
	 *
	 * @param string $table_name          The table name.
	 * @param string $created_column_name Created at column name.
	 * @param string $updated_column_name Updated at column name.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing created at column name parameter.
	 * @throws Ruckusing_Exception Missing updated at column name parameter.
	 *
	 * @return boolean
	 */
	public function add_timestamps( $table_name, $created_column_name, $updated_column_name ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $created_column_name ) ) {
			throw new Ruckusing_Exception( 'Missing created at column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $updated_column_name ) ) {
			throw new Ruckusing_Exception( 'Missing updated at column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		$created_at = $this->add_column( $table_name, $created_column_name, 'datetime' );
		$updated_at = $this->add_column( $table_name, $updated_column_name, 'timestamp', [
			'null'    => false,
			'default' => 'CURRENT_TIMESTAMP',
			'extra'   => 'ON UPDATE CURRENT_TIMESTAMP',
		] );

		return $created_at && $updated_at;
	}

	/**
	 * Removes timestamps.
	 *
	 * @param string $table_name          The table name.
	 * @param string $created_column_name Created at column name.
	 * @param string $updated_column_name Updated at column name.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing created at column name parameter.
	 * @throws Ruckusing_Exception Missing updated at column name parameter.
	 *
	 * @return boolean
	 */
	public function remove_timestamps( $table_name, $created_column_name, $updated_column_name ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $created_column_name ) ) {
			throw new Ruckusing_Exception( 'Missing created at column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $updated_column_name ) ) {
			throw new Ruckusing_Exception( 'Missing updated at column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		$updated_at = $this->remove_column( $table_name, $created_column_name );
		$created_at = $this->remove_column( $table_name, $updated_column_name );

		return $created_at && $updated_at;
	}

	/**
	 * Checks an index.
	 *
	 * @param string $table_name  The table name.
	 * @param string $column_name The column name.
	 * @param array  $options     Index options.
	 *
	 * @throws Ruckusing_Exception Missing table name parameter.
	 * @throws Ruckusing_Exception Missing column name parameter.
	 *
	 * @return boolean
	 */
	public function has_index( $table_name, $column_name, $options = [] ) {
		if ( empty( $table_name ) ) {
			throw new Ruckusing_Exception( 'Missing table name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		if ( empty( $column_name ) ) {
			throw new Ruckusing_Exception( 'Missing column name parameter', Ruckusing_Exception::INVALID_ARGUMENT );
		}
		// did the user specify an index name?
		if ( \is_array( $options ) && \array_key_exists( 'name', $options ) ) {
			$index_name = $options['name'];
		}
		else {
			$index_name = Ruckusing_Util_Naming::index_name( $table_name, $column_name );
		}
		$indexes = $this->indexes( $table_name );
		foreach ( $indexes as $idx ) {
			if ( $idx['name'] === $index_name ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Returns all indexes of a table.
	 *
	 * @param string $table_name The table name.
	 *
	 * @return array
	 */
	public function indexes( $table_name ) {
		$sql     = \sprintf( 'SHOW KEYS FROM %s', $this->identifier( $table_name ) );
		$result  = $this->select_all( $sql );
		$indexes = [];
		$cur_idx = null;
		foreach ( $result as $row ) {
			// Skip primary.
			if ( $row['Key_name'] === 'PRIMARY' ) {
				continue;
			}
			$cur_idx   = $row['Key_name'];
			$indexes[] = [ 'name' => $row['Key_name'], 'unique' => (int) $row['Non_unique'] === 0 ];
		}

		return $indexes;
	}

	/**
	 * Converts type to SQL.
	 *
	 * Default options are $limit = null, $precision = null, $scale = null.
	 *
	 * @param string $type    The native type.
	 * @param array  $options The options.
	 *
	 * @throws Ruckusing_Exception Error: I dont know what column type of '%s' maps to for MySQL.
	 * @throws Ruckusing_Exception Error adding decimal column: precision cannot be empty if scale is specified.
	 * @throws Ruckusing_Exception Error adding float column: precision cannot be empty if scale is specified.
	 * @throws Ruckusing_Exception Error adding enum column: there must be at least one value defined.
	 *
	 * @return string
	 */
	public function type_to_sql( $type, $options = [] ) {
		$natives = $this->native_database_types();
		if ( ! \array_key_exists( $type, $natives ) ) {
			$error = \sprintf( "Error: I dont know what column type of '%s' maps to for MySQL.", $type );
			$error .= "\nYou provided: {$type}\n";
			$error .= "Valid types are: \n";
			$types = \array_keys( $natives );
			foreach ( $types as $t ) {
				if ( $t === 'primary_key' ) {
					continue;
				}
				$error .= "\t{$t}\n";
			}
			throw new Ruckusing_Exception( $error, Ruckusing_Exception::INVALID_ARGUMENT );
		}
		$scale     = null;
		$precision = null;
		$limit     = null;
		if ( isset( $options['precision'] ) ) {
			$precision = $options['precision'];
		}
		if ( isset( $options['scale'] ) ) {
			$scale = $options['scale'];
		}
		if ( isset( $options['limit'] ) ) {
			$limit = $options['limit'];
		}
		if ( isset( $options['values'] ) ) {
			$values = $options['values'];
		}
		$native_type = $natives[ $type ];
		if ( \is_array( $native_type ) && \array_key_exists( 'name', $native_type ) ) {
			$column_type_sql = $native_type['name'];
		}
		else {
			return $native_type;
		}
		if ( $type === 'decimal' ) {
			// Ignore limit, use precision and scale.
			if ( $precision === null && \array_key_exists( 'precision', $native_type ) ) {
				$precision = $native_type['precision'];
			}
			if ( $scale === null && \array_key_exists( 'scale', $native_type ) ) {
				$scale = $native_type['scale'];
			}
			if ( $precision !== null ) {
				if ( \is_int( $scale ) ) {
					$column_type_sql .= \sprintf( '(%d, %d)', $precision, $scale );
				}
				else {
					$column_type_sql .= \sprintf( '(%d)', $precision );
				}
				// Scale.
			}
			else {
				if ( $scale ) {
					throw new Ruckusing_Exception( 'Error adding decimal column: precision cannot be empty if scale is specified', Ruckusing_Exception::INVALID_ARGUMENT );
				}
			}
			// Precision.
		}
		elseif ( $type === 'float' ) {
			// Ignore limit, use precision and scale.
			if ( $precision === null && \array_key_exists( 'precision', $native_type ) ) {
				$precision = $native_type['precision'];
			}
			if ( $scale === null && \array_key_exists( 'scale', $native_type ) ) {
				$scale = $native_type['scale'];
			}
			if ( $precision !== null ) {
				if ( \is_int( $scale ) ) {
					$column_type_sql .= \sprintf( '(%d, %d)', $precision, $scale );
				}
				else {
					$column_type_sql .= \sprintf( '(%d)', $precision );
				}
				// Scale.
			}
			else {
				if ( $scale ) {
					throw new Ruckusing_Exception( 'Error adding float column: precision cannot be empty if scale is specified', Ruckusing_Exception::INVALID_ARGUMENT );
				}
			}
			// Precision.
		}
		elseif ( $type === 'enum' ) {
			if ( empty( $values ) ) {
				throw new Ruckusing_Exception( 'Error adding enum column: there must be at least one value defined', Ruckusing_Exception::INVALID_ARGUMENT );
			}
			else {
				$column_type_sql .= \sprintf( "('%s')", \implode( "','", \array_map( [
					$this,
					'quote_string',
				], $values ) ) );
			}
		}
		// Not a decimal column.
		if ( $limit === null && \array_key_exists( 'limit', $native_type ) ) {
			$limit = $native_type['limit'];
		}
		if ( $limit ) {
			$column_type_sql .= \sprintf( '(%d)', $limit );
		}

		return $column_type_sql;
	}

	/**
	 * Adds column options.
	 *
	 * @param string $type    The native type.
	 * @param array  $options The options.
	 *
	 * @throws Ruckusing_Exception MySQL does not support function calls as default values, constants only.
	 *
	 * @return string
	 */
	public function add_column_options( $type, $options ) {
		$sql = '';
		if ( ! \is_array( $options ) ) {
			return $sql;
		}
		if ( \array_key_exists( 'unsigned', $options ) && $options['unsigned'] === true ) {
			$sql .= ' UNSIGNED';
		}
		if ( \array_key_exists( 'character', $options ) ) {
			$sql .= \sprintf( ' CHARACTER SET %s', $this->identifier( $options['character'] ) );
		}
		if ( \array_key_exists( 'collate', $options ) ) {
			$sql .= \sprintf( ' COLLATE %s', $this->identifier( $options['collate'] ) );
		}
		if ( \array_key_exists( 'auto_increment', $options ) && $options['auto_increment'] === true ) {
			$sql .= ' auto_increment';
		}
		if ( \array_key_exists( 'default', $options ) && $options['default'] !== null ) {
			if ( $this->is_sql_method_call( $options['default'] ) ) {
				throw new Ruckusing_Exception( 'MySQL does not support function calls as default values, constants only.', Ruckusing_Exception::INVALID_ARGUMENT );
			}
			if ( \is_int( $options['default'] ) ) {
				$default_format = '%d';
			}
			elseif ( \is_bool( $options['default'] ) ) {
				$default_format = "'%d'";
			}
			elseif ( $options['default'] === 'CURRENT_TIMESTAMP' ) {
				$default_format = '%s';
			}
			else {
				$default_format = "'%s'";
			}
			$default_value = \sprintf( $default_format, $options['default'] );
			$sql           .= \sprintf( ' DEFAULT %s', $default_value );
		}
		if ( \array_key_exists( 'null', $options ) ) {
			if ( $options['null'] === false || $options['null'] === 'NO' ) {
				$sql .= ' NOT NULL';
			}
			elseif ( 'timestamp' === $type ) {
				$sql .= ' NULL';
			}
		}
		if ( \array_key_exists( 'comment', $options ) ) {
			$sql .= \sprintf( " COMMENT '%s'", $this->quote_string( $options['comment'] ) );
		}
		if ( \array_key_exists( 'extra', $options ) ) {
			$sql .= \sprintf( ' %s', $this->quote_string( $options['extra'] ) );
		}
		if ( \array_key_exists( 'after', $options ) ) {
			$sql .= \sprintf( ' AFTER %s', $this->identifier( $options['after'] ) );
		}

		return $sql;
	}

	/**
	 * Sets the current version.
	 *
	 * @param string $version The version.
	 *
	 * @return boolean
	 */
	public function set_current_version( $version ) {
		$sql = \sprintf( "INSERT INTO %s (version) VALUES ('%s')", $this->get_schema_version_table_name(), $version );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Removes a version.
	 *
	 * @param string $version The version.
	 *
	 * @return boolean
	 */
	public function remove_version( $version ) {
		$sql = \sprintf( "DELETE FROM %s WHERE version = '%s'", $this->get_schema_version_table_name(), $version );

		return $this->execute_ddl( $sql );
	}

	/**
	 * Returns a message displaying the current version.
	 *
	 * @return string
	 */
	public function __toString() {
		return 'Ruckusing_Adapter, version ' . $this->_version;
	}

	// -----------------------------------
	// PRIVATE METHODS
	// -----------------------------------
	/**
	 * Delegates to PEAR.
	 *
	 * @param boolean $o The object to check.
	 *
	 * @return boolean True if the object equals false.
	 */
	private function isError( $o ) {
		return $o === false;
	}

	/**
	 * Initializes an array of table names.
	 *
	 * @param boolean $reload Pass true to reload.
	 *
	 * @throws Ruckusing_Exception Error executing 'query'.
	 */
	private function load_tables( $reload = true ) {
		global $wpdb;

		if ( $this->_tables_loaded === false || $reload ) {
			$this->_tables = [];
			// Clear existing structure.
			$query = 'SHOW TABLES';
			$res   = $wpdb->get_results( $query, \ARRAY_N );
			// Check for errors.
			if ( $this->isError( $res ) ) {
				throw new Ruckusing_Exception( \sprintf( "Error executing 'query' with:\n%s\n\nReason: %s\n\n", $query, $wpdb->last_error ), Ruckusing_Exception::QUERY_ERROR );
			}
			foreach ( $res as $row ) {
				$table                   = $row[0];
				$this->_tables[ $table ] = true;
			}
		}
	}

	/**
	 * Checks the query type of a query.
	 *
	 * @param string $query Query to run.
	 *
	 * @return int The query type.
	 */
	private function determine_query_type( $query ) {
		$query = \strtolower( \trim( $query ) );
		$match = [];
		\preg_match( '/^(\\w)*/i', $query, $match );
		$type = $match[0];
		switch ( $type ) {
			case 'select':
				return SQL_SELECT;
			case 'update':
				return SQL_UPDATE;
			case 'delete':
				return SQL_DELETE;
			case 'insert':
				return SQL_INSERT;
			case 'alter':
				return SQL_ALTER;
			case 'drop':
				return SQL_DROP;
			case 'create':
				return SQL_CREATE;
			case 'show':
				return SQL_SHOW;
			case 'rename':
				return SQL_RENAME;
			case 'set':
				return SQL_SET;
			default:
				return SQL_UNKNOWN_QUERY_TYPE;
		}
	}

	/**
	 * Checks if the query type is select.
	 *
	 * @param int $query_type The query type to check.
	 *
	 * @internal param string $query Query to run.
	 *
	 * @return boolean
	 */
	private function is_select( $query_type ) {
		if ( $query_type === SQL_SELECT ) {
			return true;
		}

		return false;
	}

	/**
	 * Detects whether or not the string represents a function call and if so
	 * do not wrap it in single-quotes, otherwise do wrap in single quotes.
	 *
	 * @param string $str The string to check.
	 *
	 * @return boolean
	 */
	private function is_sql_method_call( $str ) {
		$str = \trim( $str );
		if ( \substr( $str, - 2, 2 ) === '()' ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks if in transaction.
	 *
	 * @return boolean
	 */
	private function inTransaction() {
		return $this->_in_trx;
	}

	/**
	 * Starts a transaction.
	 *
	 * @throws Ruckusing_Exception Transaction already started.
	 */
	private function beginTransaction() {
		global $wpdb;

		if ( $this->_in_trx === true ) {
			throw new Ruckusing_Exception( 'Transaction already started', Ruckusing_Exception::QUERY_ERROR );
		}
		$wpdb->query( 'START TRANSACTION' );
		$this->_in_trx = true;
	}

	/**
	 * Commits a transaction.
	 *
	 * @throws Ruckusing_Exception Transaction not started.
	 */
	private function commit() {
		global $wpdb;

		if ( $this->_in_trx === false ) {
			throw new Ruckusing_Exception( 'Transaction not started', Ruckusing_Exception::QUERY_ERROR );
		}
		$wpdb->query( 'COMMIT' );
		$this->_in_trx = false;
	}

	/**
	 * Rolls back a transaction.
	 *
	 * @throws Ruckusing_Exception Transaction not started.
	 */
	private function rollback() {
		global $wpdb;

		if ( $this->_in_trx === false ) {
			throw new Ruckusing_Exception( 'Transaction not started', Ruckusing_Exception::QUERY_ERROR );
		}
		$wpdb->query( 'ROLLBACK' );
		$this->_in_trx = false;
	}
}
