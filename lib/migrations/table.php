<?php
/**
 * Yoast migrations adapter class.
 *
 * @package Yoast\WP\Lib\Migrations
 */

namespace Yoast\WP\Lib\Migrations;

use Exception;

/**
 * Table class
 */
class Table {

	/**
	 * The adapter.
	 *
	 * @var Adapter
	 */
	private $_adapter;

	/**
	 * The name
	 *
	 * @var string
	 */
	private $_name;

	/**
	 * The options
	 *
	 * @var array
	 */
	private $_options;

	/**
	 * The SQL representation of this table.
	 *
	 * @var string
	 */
	private $_sql = '';

	/**
	 * Whether or not the table has been initialized.
	 *
	 * @var boolean
	 */
	private $_initialized = false;

	/**
	 * The columns
	 *
	 * @var Column[]
	 */
	private $_columns = [];

	/**
	 * The primary keys.
	 *
	 * @var string[]
	 */
	private $_primary_keys = [];

	/**
	 * Whether or not to auto generate the id.
	 *
	 * @var boolean
	 */
	private $_auto_generate_id = true;

	/**
	 * Creates an instance of Ruckusing_Adapters_MySQL_Adapter
	 *
	 * @param Adapter $adapter The current adapter.
	 * @param string  $name    The table name.
	 * @param array   $options The options.
	 *
	 * @throws Exception If invalid arguments are passed.
	 *
	 * @return Table
	 */
	public function __construct( $adapter, $name, $options = [] ) {
		// Sanity checks.
		if ( ! $adapter instanceof Adapter ) {
			throw new Exception( 'Invalid MySQL Adapter instance.' );
		}
		if ( ! $name ) {
			throw new Exception( "Invalid 'name' parameter" );
		}
		$this->_adapter = $adapter;
		$this->_name = $name;
		$this->_options = $options;
		$this->init_sql( $name, $options );
		if ( \array_key_exists( 'id', $options ) ) {
			if ( \is_bool( $options['id'] ) && $options['id'] === false ) {
				$this->_auto_generate_id = false;
			}

			// If its a string then we want to auto-generate an integer-based
			// primary key with this name.
			if ( \is_string( $options['id'] ) ) {
				$this->_auto_generate_id = true;
				$this->_primary_keys[] = $options['id'];
			}
		}
	}

	/**
	 * Create a column
	 *
	 * @param string $column_name The column name.
	 * @param string $type        The column type.
	 * @param array  $options     The options.
	 */
	public function column( $column_name, $type, $options = [] ) {
		// If there is already a column by the same name then silently fail and continue.
		foreach ( $this->_columns as $column ) {
			if ( $column->name === $column_name ) {
				return;
			}
		}

		$column_options = [];
		if ( \array_key_exists( 'primary_key', $options ) ) {
			if ( $options['primary_key'] ) {
				$this->_primary_keys[] = $column_name;
			}
		}
		if ( \array_key_exists( 'auto_increment', $options ) ) {
			if ( $options['auto_increment'] ) {
				$column_options['auto_increment'] = true;
			}
		}
		$column_options = \array_merge( $column_options, $options );
		$column = new Column( $this->_adapter, $column_name, $type, $column_options );
		$this->_columns[] = $column;
	}

	/**
	 * Shortcut to create timestamps columns (default created_at, updated_at)
	 *
	 * @param string $created_column_name Created at column name.
	 * @param string $updated_column_name Updated at column name.
	 */
	public function timestamps( $created_column_name = 'created_at', $updated_column_name = 'updated_at' ) {
		$this->column( $created_column_name, 'datetime' );
		$this->column( $updated_column_name, 'timestamp', [ 'null' => false, 'default' => 'CURRENT_TIMESTAMP', 'extra' => 'ON UPDATE CURRENT_TIMESTAMP' ] );
	}
	/**
	 * Get all primary keys
	 *
	 * @return string
	 */
	private function keys() {
		if ( \count( $this->_primary_keys ) > 0 ) {
			$lead = ' PRIMARY KEY (';
			$quoted = [];
			foreach ( $this->_primary_keys as $key ) {
				$quoted[] = \sprintf( '%s', $this->_adapter->identifier( $key ) );
			}
			$primary_key_sql = ",\n" . $lead . \implode( ',', $quoted ) . ')';
			return $primary_key_sql;
		}

		return '';
	}
	/**
	 * Table definition
	 *
	 * @param boolean $wants_sql Whether or not to return SQL or execute the query. Defaults to false.
	 *
	 * @throws Exception If the table definition has not been intialized.
	 * @return boolean | string
	 */
	public function finish( $wants_sql = false ) {
		if ( $this->_initialized == false ) {
			throw new Exception( \sprintf( "Table Definition: '%s' has not been initialized", $this->_name ) );
		}
		$opt_str = '';
		if ( \is_array( $this->_options ) && \array_key_exists( 'options', $this->_options ) ) {
			$opt_str = $this->_options['options'];
		} else {
			if ( isset( $this->_adapter->db_info['charset'] ) ) {
				$opt_str = ' DEFAULT CHARSET=' . $this->_adapter->db_info['charset'];
			} else {
				$opt_str = ' DEFAULT CHARSET=utf8';
			}
		}
		$close_sql = \sprintf( ') %s;', $opt_str );
		$create_table_sql = $this->_sql;
		if ( $this->_auto_generate_id === true ) {
			$this->_primary_keys[] = 'id';
			$primary_id = new \YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition( $this->_adapter, 'id', 'integer', [ 'unsigned' => true, 'null' => false, 'auto_increment' => true ] );
			$create_table_sql .= $primary_id->to_sql() . ",\n";
		}
		$create_table_sql .= $this->columns_to_str();
		$create_table_sql .= $this->keys() . $close_sql;
		if ( $wants_sql ) {
			return $create_table_sql;
		} else {
			return $this->_adapter->execute_ddl( $create_table_sql );
		}
	}
	// finish
	/**
	 * get all columns
	 *
	 * @return string
	 */
	private function columns_to_str() {
		$str = '';
		$fields = [];
		$len = \count( $this->_columns );
		for ( $i = 0; $i < $len; $i++ ) {
			$c = $this->_columns[ $i ];
			$fields[] = $c->__toString();
		}
		return \join( ",\n", $fields );
	}
	/**
	 * Init create sql
	 *
	 * @param string $name
	 * @param array  $options
	 * @throws Exception
	 * @throws Ruckusing_Exception
	 */
	private function init_sql( $name, $options ) {
		// are we forcing table creation? If so, drop it first
		if ( \array_key_exists( 'force', $options ) && $options['force'] == true ) {
			try {
				$this->_adapter->drop_table( $name );
			} catch (Exception $e) {
				if ( $e->getCode() != Exception::MISSING_TABLE ) {
					throw $e;
				}
				// do nothing
			}
		}
		$temp = '';
		if ( \array_key_exists( 'temporary', $options ) ) {
			$temp = ' TEMPORARY';
		}
		$create_sql = \sprintf( 'CREATE%s TABLE ', $temp );
		$create_sql .= \sprintf( "%s (\n", $this->_adapter->identifier( $name ) );
		$this->_sql .= $create_sql;
		$this->_initialized = true;
	}
}
