<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Config;

use wpdb;
use Yoast\WP\Lib\Ruckusing_Framework_Runner;
use Yoast\WP\SEO\Config\Dependency_Management;
use YoastSEO_Vendor\Ruckusing_Task_Manager;
use YoastSEO_Vendor\Task_Db_Migrate;

/**
 * Class Ruckusing_Framework
 */
class Ruckusing_Framework {

	/**
	 * The database object.
	 *
	 * @var \wpdb
	 */
	protected $wpdb;

	/**
	 * The dependency management checker.
	 *
	 * @var \Yoast\WP\SEO\Config\Dependency_Management
	 */
	protected $dependency_management;

	/**
	 * Ruckusing_Framework constructor.
	 *
	 * @param \wpdb                                      $wpdb                  The wpdb instance.
	 * @param \Yoast\WP\SEO\Config\Dependency_Management $dependency_management The dependency management checker.
	 */
	public function __construct(
		wpdb $wpdb,
		Dependency_Management $dependency_management
	) {
		$this->wpdb                  = $wpdb;
		$this->dependency_management = $dependency_management;
	}

	/**
	 * Gets the ruckusing framework runner.
	 *
	 * @param string $migrations_table_name The migrations table name.
	 * @param string $migrations_directory  The migrations directory.
	 *
	 * @return Ruckusing_Framework_Runner The framework runner.
	 */
	public function get_framework_runner( $migrations_table_name, $migrations_directory ) {
		$this->maybe_set_constant();

		$configuration = $this->get_configuration( $migrations_table_name, $migrations_directory );
		$instance      = new Ruckusing_Framework_Runner( $configuration, [ 'db:migrate', 'env=production' ] );

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
	 * @return \YoastSEO_Vendor\Ruckusing_Task_Manager The task manager.
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
		$ruckusing_config = [
			'db'             => [
				'production' => [
					'schema_version_table_name' => $migrations_table_name,
				],
			],
			'migrations_dir' => [ 'default' => $migrations_directory ],
		];

		if ( ! empty( $this->wpdb->charset ) ) {
			$ruckusing_config['db']['production']['charset'] = $this->wpdb->charset;
		}

		return $ruckusing_config;
	}

	/**
	 * Sets the constant required by the ruckusing framework.
	 *
	 * @return bool Whether or not the constant is now the correct value.
	 */
	public function maybe_set_constant() {
		$constant_name  = $this->dependency_management->prefixed_available() ? \YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_BASE' : 'RUCKUSING_BASE';
		$constant_value = \WPSEO_PATH . 'src/config/migrations' . \DIRECTORY_SEPARATOR . 'ruckusing';

		if ( \defined( $constant_name ) ) {
			return \constant( $constant_name ) === $constant_value;
		}

		return \define( $constant_name, $constant_value );
	}
}
