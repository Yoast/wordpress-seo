<?php
/**
 * Yoast ORM class.
 *
 * @package Yoast\WP\Lib
 */

namespace Yoast\WP\Lib;

use YoastSEO_Vendor\Ruckusing_Exception;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;
use YoastSEO_Vendor\Ruckusing_Task_Manager;
use YoastSEO_Vendor\Ruckusing_Util_Migrator;

/**
 * Ruckusing
 *
 * @category  Ruckusing
 * @package   Ruckusing
 * @author    Cody Caughlan <codycaughlan % gmail . com>
 * @link      https://github.com/ruckus/ruckusing-migrations
 */
/**
 * Ruckusing_FrameworkRunner
 *
 * Primary work-horse class. This class bootstraps the framework by loading
 * all adapters and tasks.
 *
 * @category Ruckusing
 * @package  Ruckusing
 * @author   Cody Caughlan <codycaughlan % gmail . com>
 * @link     https://github.com/ruckus/ruckusing-migrations
 */
class Ruckusing_Framework_Runner extends Ruckusing_FrameworkRunner {
	/**
	 * Available DB config (e.g. test,development, production)
	 *
	 * @var array
	 */
	private $_config = [];
	/**
	 * Task manager
	 *
	 * @var Ruckusing_Task_Manager
	 */
	private $_task_mgr = null;
	/**
	 * Adapter
	 *
	 * @var Ruckusing_Adapter_Base
	 */
	private $_adapter = null;
	/**
	 * Current task name
	 *
	 * @var string
	 */
	private $_cur_task_name = '';
	/**
	 * Task options
	 *
	 * @var string
	 */
	private $_task_options = '';
	/**
	 * Environment
	 * default is development
	 * but can also be one 'test', 'production', etc...
	 *
	 * @var string
	 */
	private $_env = 'development';
	/**
	 * Flag to display help of task
	 *
	 * @see Ruckusing_FrameworkRunner::parse_args
	 *
	 * @var boolean
	 */
	private $_showhelp = \false;
	/**
	 * Creates an instance of Ruckusing_Adapters_Base
	 *
	 * @param array $config The current config.
	 * @param array $argv   the supplied command line arguments.
	 *
	 * @return Ruckusing_FrameworkRunner
	 */
	public function __construct( $config, $argv ) {
		\set_error_handler( [ Ruckusing_Exception::class, 'errorHandler' ], \E_ALL );
		\set_exception_handler( [ Ruckusing_Exception::class, 'exceptionHandler' ] );
		// Parse arguments.
		$this->parse_args( $argv );
		// Set config variables.
		$this->_config = $config;
		// Verify config array.
		$this->initialize_db();
		// Initialize tasks.
		$this->init_tasks();
	}
	/**
	 * Execute the current task
	 */
	public function execute() {
		$output = '';
		if ( empty( $this->_cur_task_name ) ) {
			if ( isset( $_SERVER['argv'][1] ) && \stripos( $_SERVER['argv'][1], '=' ) === \false ) {
				$output .= \sprintf( "\n\tWrong Task format: %s\n", $_SERVER['argv'][1] );
			}
			$output .= $this->help();
		} else {
			if ( $this->_task_mgr->has_task( $this->_cur_task_name ) ) {
				if ( $this->_showhelp ) {
					$output .= $this->_task_mgr->help( $this->_cur_task_name );
				} else {
					$output .= $this->_task_mgr->execute( $this, $this->_cur_task_name, $this->_task_options );
				}
			} else {
				$output .= \sprintf( "\n\tTask not found: %s\n", $this->_cur_task_name );
				$output .= $this->help();
			}
		}
		return $output;
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
	 * Initialize the task manager
	 */
	public function init_tasks() {
		$this->_task_mgr = new Ruckusing_Task_Manager( $this->_adapter, $this->_config );
	}
	/**
	 * Get the current migration dir
	 *
	 * @param string $key the module key name.
	 *
	 * @return string
	 */
	public function migrations_directory( $key = '' ) {
		$migration_dir = '';
		if ( $key ) {
			if ( ! isset( $this->_config['migrations_dir'][ $key ] ) ) {
				throw new Ruckusing_Exception( \sprintf( 'No module %s migration_dir set in config', $key ), Ruckusing_Exception::INVALID_CONFIG );
			}
			$migration_dir = $this->_config['migrations_dir'][ $key ] . \DIRECTORY_SEPARATOR;
		}
		elseif ( \is_array( $this->_config['migrations_dir'] ) ) {
			$migration_dir = $this->_config['migrations_dir']['default'] . \DIRECTORY_SEPARATOR;
		}
		else {
			$migration_dir = $this->_config['migrations_dir'] . \DIRECTORY_SEPARATOR;
		}
		if ( \array_key_exists( 'directory', $this->_config['db'][ $this->_env ] ) ) {
			return $migration_dir . $this->_config['db'][ $this->_env ]['directory'];
		}
		return $migration_dir . $this->_config['db'][ $this->_env ]['database'];
	}
	/**
	 * Get all migrations directory
	 *
	 * @return array
	 */
	public function migrations_directories() {
		$result = [];
		if ( \is_array( $this->_config['migrations_dir'] ) ) {
			foreach ( $this->_config['migrations_dir'] as $name => $path ) {
				$result[ $name ] = $path . \DIRECTORY_SEPARATOR;
			}
		} else {
			$result['default'] = $this->_config['migrations_dir'] . \DIRECTORY_SEPARATOR;
		}
		return $result;
	}
	/**
	 * Get the current db schema dir
	 *
	 * @return string
	 */
	public function db_directory() {
		$path = $this->_config['db_dir'] . \DIRECTORY_SEPARATOR;
		if ( \array_key_exists( 'directory', $this->_config['db'][ $this->_env ] ) ) {
			return $path . $this->_config['db'][ $this->_env ]['directory'];
		}
		return $path . $this->_config['db'][ $this->_env ]['database'];
	}
	/**
	 * Initialize the db
	 */
	public function initialize_db() {
		$db = $this->_config['db'][ $this->_env ];
		$this->_adapter = new Ruckusing_Adapter( $db );
	}
	/**
	 * $argv is our complete command line argument set.
	 * PHP gives us:
	 * [0] = the actual file name we're executing
	 * [1..N] = all other arguments
	 *
	 * Our task name should be at slot [1]
	 * Anything else are additional parameters that we can pass
	 * to our task and they can deal with them as they see fit.
	 *
	 * @param array $argv the current command line arguments
	 */
	private function parse_args( $argv ) {
		$num_args = \count( $argv );
		$options = [];
		for ( $i = 0; $i < $num_args; $i++ ) {
			$arg = $argv[ $i ];
			if ( \stripos( $arg, ':' ) !== \false ) {
				$this->_cur_task_name = $arg;
			} elseif ( $arg == 'help' ) {
				$this->_showhelp = \true;
				continue;
			} elseif ( \stripos( $arg, '=' ) !== \false ) {
				list($key, $value) = \explode( '=', $arg );
				$key = \strtolower( $key );
				// Allow both upper and lower case parameters
				$options[ $key ] = $value;
				if ( $key == 'env' ) {
					$this->_env = $value;
				}
			}
		}
		$this->_task_options = $options;
	}
	/**
	 * Update the local schema to handle multiple records versus the prior architecture
	 * of storing a single version. In addition take all existing migration files
	 * and register them in our new table, as they have already been executed.
	 */
	public function update_schema_for_timestamps() {
		// only create the table if it doesnt already exist
		$this->_adapter->create_schema_version_table();
		// insert all existing records into our new table
		$migrator_util = new Ruckusing_Util_Migrator( $this->_adapter );
		$files = $migrator_util->get_migration_files( $this->migrations_directories(), 'up' );
		foreach ( $files as $file ) {
			if ( (int) $file['version'] >= \PHP_INT_MAX ) {
				// its new style like '20081010170207' so its not a candidate
				continue;
			}
			// query old table, if it less than or equal to our max version, then its a candidate for insertion
			$query_sql = \sprintf( 'SELECT version FROM %s WHERE version >= %d', \YoastSEO_Vendor\RUCKUSING_SCHEMA_TBL_NAME, $file['version'] );
			$existing_version_old_style = $this->_adapter->select_one( $query_sql );
			if ( \count( $existing_version_old_style ) > 0 ) {
				// make sure it doesnt exist in our new table, who knows how it got inserted?
				$new_vers_sql = \sprintf( 'SELECT version FROM %s WHERE version = %d', $this->_adapter->get_schema_version_table_name(), $file['version'] );
				$existing_version_new_style = $this->_adapter->select_one( $new_vers_sql );
				if ( empty( $existing_version_new_style ) ) {
					// use sprintf & %d to force it to be stripped of any leading zeros, we *know* this represents an old version style
					// so we dont have to worry about PHP and integer overflow
					$insert_sql = \sprintf( 'INSERT INTO %s (version) VALUES (%d)', $this->_adapter->get_schema_version_table_name(), $file['version'] );
					$this->_adapter->query( $insert_sql );
				}
			}
		}
	}
}
