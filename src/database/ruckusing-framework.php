<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Database;

use wpdb;
use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Loggers\Migration_Logger;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;
use YoastSEO_Vendor\Ruckusing_Task_Manager;
use YoastSEO_Vendor\Task_Db_Migrate;

/**
 * Class Ruckusing_Framework
 */
class Ruckusing_Framework {

	/**
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * @var Dependency_Management
	 */
	protected $dependency_management;

	/**
	 * @var Migration_Logger
	 */
	protected $migration_logger;

	/**
	 * Ruckusing_Framework constructor.
	 *
	 * @param wpdb                  $wpdb                  The wpdb instance.
	 * @param Dependency_Management $dependency_management The dependency management checker.
	 * @param Migration_Logger      $migration_logger      The migration logger, extends the Ruckusing logger.
	 */
	public function __construct( wpdb $wpdb, Dependency_Management $dependency_management, Migration_Logger $migration_logger ) {
		$this->wpdb                  = $wpdb;
		$this->dependency_management = $dependency_management;
		$this->migration_logger      = $migration_logger;
	}

	/**
	 * Gets the ruckusing framework runner.
	 *
	 * @param string $migrations_table_name The migrations table name.
	 * @param string $migrations_directory  The migrations directory.
	 *
	 * @return Ruckusing_FrameworkRunner The framework runner.
	 */
	public function get_framework_runner( $migrations_table_name, $migrations_directory ) {
		$this->maybe_set_constant();

		$configuration = $this->get_configuration( $migrations_table_name, $migrations_directory );
		$instance      = new Ruckusing_FrameworkRunner( $configuration, [ 'db:migrate', 'env=production' ], $this->migration_logger );

		/*
		 * As the Ruckusing_FrameworkRunner is setting its own error and exception handlers,
		 * we need to restore the defaults.
		 */
		\restore_error_handler();
		\restore_exception_handler();

		return $instance;
	}

	/**
	 * Gets the ruckusing framework task manager.
	 *
	 * @param \YoastSEO_Vendor\Ruckusing_Adapter_MySQL_Base $adapter               The MySQL adapter.
	 * @param string                                        $migrations_table_name The migrations table name.
	 * @param string                                        $migrations_directory  The migrations directory.
	 *
	 * @return Ruckusing_Task_Manager The task manager.
	 * @throws \YoastSEO_Vendor\Ruckusing_Exception If any of the arguments are invalid.
	 */
	public function get_framework_task_manager( $adapter, $migrations_table_name, $migrations_directory ) {
		$task_manager = new Ruckusing_Task_Manager( $adapter, $this->get_configuration( $migrations_table_name, $migrations_directory ) );
		$task_manager->register_task( 'db:migrate', new Task_Db_Migrate( $adapter ) );

		return $task_manager;
	}

	/**
	 * Returns the framework configuration for a given migrations table name and directory.
	 *
	 * @param string $migrations_table_name The migrations table name.
	 * @param string $migrations_directory  The migrations directory.
	 *
	 * @return array The configuration
	 */
	public function get_configuration( $migrations_table_name, $migrations_directory ) {
		return [
			'db'             => [
				'production' => [
					'type'                      => 'mysql',
					'host'                      => \DB_HOST,
					'port'                      => 3306,
					'database'                  => \DB_NAME,
					'user'                      => \DB_USER,
					'password'                  => \DB_PASSWORD,
					'charset'                   => $this->wpdb->charset,
					'directory'                 => '', // This needs to be set, to use the migrations folder as base folder.
					'schema_version_table_name' => $migrations_table_name,
				],
			],
			'migrations_dir' => [ 'default' => $migrations_directory ],
			// This needs to be set but is not used.
			'db_dir'         => true,
			// This needs to be set but is not used.
			'log_dir'        => true,
			// This needs to be set but is not used.
		];
	}

	/**
	 * Sets the constant required by the ruckusing framework.
	 *
	 * @return bool Whether or not the constant is now the correct value.
	 */
	public function maybe_set_constant() {
		$constant_name  = $this->dependency_management->prefixed_available() ? \YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_BASE' : 'RUCKUSING_BASE';
		$constant_value = \WPSEO_PATH . 'migrations' . DIRECTORY_SEPARATOR . 'ruckusing';

		if ( \defined( $constant_name ) ) {
			return \constant( $constant_name ) === $constant_value;
		}

		return \define( $constant_name, $constant_value );
	}
}
