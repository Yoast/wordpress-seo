<?php
/**
 * Makes sure the database migrations are run.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Config;

use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Loggers\Migration_Logger;
use Yoast\WP\Free\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

/**
 * Triggers database migrations and handles results.
 */
class Database_Migration {

	/**
	 * @var int
	 */
	const MIGRATION_STATE_SUCCESS = 0;

	/**
	 * @var int
	 */
	const MIGRATION_STATE_ERROR = 1;

	/**
	 * @var string
	 */
	const MIGRATION_ERROR_TRANSIENT_KEY = 'yoast_migration_problem';

	/**
	 * WPDB instance.
	 *
	 * @var \wpdb
	 */
	protected $wpdb;

	/**
	 * @var \Yoast\WP\Free\Config\Dependency_Management
	 */
	protected $dependency_management;

	/**
	 * Configuration for the database migration.
	 *
	 * Should have at least two keys:
	 *  - `directory`:  The directory in which the migrations are located.
	 *  - `table_name`: The name of the database table in which the previously run migrations are stored.
	 *
	 * @var array
	 */
	protected $config;

	/**
	 * Migrations constructor.
	 *
	 * @param \wpdb                                       $wpdb                  Database class to use.
	 * @param \Yoast\WP\Free\Config\Dependency_Management $dependency_management Dependency Management to use.
	 * @param array                                       $config                Configuration, associative array should include a 'directory' string,
	 *                                                                           which configures where the migrations that need to be run
	 *                                                                           are located, and a 'table_name' string, which configures
	 *                                                                           the name of the table in which the migration versions are stored.
	 */
	public function __construct( $wpdb, Dependency_Management $dependency_management, $config ) {
		$this->wpdb                  = $wpdb;
		$this->dependency_management = $dependency_management;
		$this->config                = $config;
		// Prepend table name with the Yoast namespace.
		$this->config['table_name'] = Yoast_Model::get_table_name( $this->config['table_name'] );
	}

	/**
	 * Initializes the migrations.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function run_migrations() {
		// If the defines could not be set, we do not want to run.
		if ( ! $this->set_defines() ) {
			$this->set_failed_state( 'Defines could not be set.' );

			return false;
		}

		try {
			$main = $this->get_framework_runner();
			$main->execute();
		}
		catch ( \Exception $exception ) {
			Logger::get_logger()->error( $exception->getMessage() );

			// Something went wrong...
			$this->set_failed_state( $exception->getMessage() );

			return false;
		}

		$this->set_success_state();

		return true;
	}

	/**
	 * Retrieves the state of the migrations.
	 *
	 * @return bool True if migrations have completed successfully.
	 */
	public function is_usable() {
		return ( $this->get_migration_state() === self::MIGRATION_STATE_SUCCESS );
	}

	/**
	 * Retrieves the state of the migrations.
	 *
	 * @return bool True if migrations have completed successfully.
	 */
	public function has_migration_error() {
		return ( $this->get_migration_state() === self::MIGRATION_STATE_ERROR );
	}

	/**
	 * Retrieves the database charset.
	 *
	 * @return string Charset configured for the database.
	 */
	protected function get_charset() {
		return $this->wpdb->charset;
	}

	/**
	 * Registers defines needed for Ruckusing to work.
	 *
	 * @return bool True on success, false when the defines are already set.
	 */
	protected function set_defines() {
		foreach ( $this->get_defines() as $key => $value ) {
			if ( ! $this->set_define( $key, $value ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Handles state persistence for a failed migration environment.
	 *
	 * @param string $message Message explaining the reason for the failed state.
	 *
	 * @return void
	 */
	protected function set_failed_state( $message ) {
		// @todo do something with the message.
		\set_transient( $this->get_error_transient_key(), self::MIGRATION_STATE_ERROR, \DAY_IN_SECONDS );
	}

	/**
	 * Removes the problem state from the system.
	 *
	 * @return void
	 */
	protected function set_success_state() {
		\delete_transient( $this->get_error_transient_key() );
	}

	/**
	 * Retrieves the current migration state.
	 *
	 * @return int|null Migration state.
	 */
	protected function get_migration_state() {
		return \get_transient( $this->get_error_transient_key(), self::MIGRATION_STATE_SUCCESS );
	}

	/**
	 * Retrieves the Ruckusing instance to run migrations with.
	 *
	 * @return \YoastSEO_Vendor\Ruckusing_FrameworkRunner Framework runner to use.
	 */
	protected function get_framework_runner() {
		$main = new Ruckusing_FrameworkRunner(
			$this->get_configuration(),
			array(
				'db:migrate',
				'env=production',
			),
			new Migration_Logger()
		);

		/*
		 * As the Ruckusing_FrameworkRunner is setting its own error and exception handlers,
		 * we need to restore the defaults.
		 */
		\restore_error_handler();
		\restore_exception_handler();

		return $main;
	}

	/**
	 * Retrieves the migration configuration.
	 *
	 * @return array List of configuration elements.
	 */
	protected function get_configuration() {
		return array(
			'db'             => array(
				'production' => array(
					'type'                      => 'mysql',
					'host'                      => \DB_HOST,
					'port'                      => 3306,
					'database'                  => \DB_NAME,
					'user'                      => \DB_USER,
					'password'                  => \DB_PASSWORD,
					'charset'                   => $this->get_charset(),
					'directory'                 => '', // This needs to be set, to use the migrations folder as base folder.
					'schema_version_table_name' => $this->config['table_name'],
				),
			),
			'migrations_dir' => array( 'default' => $this->config['directory'] ),
			// This needs to be set but is not used.
			'db_dir'         => true,
			// This needs to be set but is not used.
			'log_dir'        => true,
			// This needs to be set but is not used.
		);
	}

	/**
	 * Registers a define or makes sure the existing value is the one we can use.
	 *
	 * @param string $define Constant to check.
	 * @param string $value  Value to set when not defined yet.
	 *
	 * @return bool True if the define has the value we want it to be.
	 */
	protected function set_define( $define, $value ) {
		if ( \defined( $define ) ) {
			return \constant( $define ) === $value;
		}

		return \define( $define, $value );
	}

	/**
	 * Retrieves a list of defines that should be set.
	 *
	 * @return array List of defines to be set.
	 */
	protected function get_defines() {
		if ( $this->dependency_management->prefixed_available() ) {
			return array(
				\YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_BASE' => WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/ruckusing',
			);
		}

		return array(
			'RUCKUSING_BASE' => WPSEO_PATH . 'vendor/ruckusing/ruckusing-migrations',
		);
	}

	/**
	 * Retrieves the error state transient key to use.
	 *
	 * @return string The transient key to use for storing the error state.
	 */
	protected function get_error_transient_key() {
		return self::MIGRATION_ERROR_TRANSIENT_KEY . '_' . $this->config['table_name'];
	}
}
