<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Database;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\ORM\Yoast_Model;
use Yoast\WP\Free\WordPress\Initializer;

/**
 * Triggers database migrations and handles results.
 */
class Migration_Runner implements Initializer {

	/**
	 * Retrieves the conditionals for the migrations.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * The value for a migration success state.
	 *
	 * @var int
	 */
	const MIGRATION_STATE_SUCCESS = 0;

	/**
	 * The value for a migration state error.
	 *
	 * @var int
	 */
	const MIGRATION_STATE_ERROR = 1;

	/**
	 * The value that communicates a migration problem.
	 *
	 * @var string
	 */
	const MIGRATION_ERROR_TRANSIENT_KEY = 'yoast_migration_problem_';

	/**
	 * The Ruckusing framework runner.
	 *
	 * @var \Yoast\WP\Free\Database\Ruckusing_Framework
	 */
	protected $framework;

	/**
	 * The logger object.
	 *
	 * @var \Yoast\WP\Free\Loggers\Logger
	 */
	protected $logger;

	/**
	 * Migrations constructor.
	 *
	 * @param \Yoast\WP\Free\Database\Ruckusing_Framework $framework The Ruckusing framework runner.
	 * @param \Yoast\WP\Free\Loggers\Logger               $logger    A PSR compatible logger.
	 */
	public function __construct( Ruckusing_Framework $framework, Logger $logger ) {
		$this->framework = $framework;
		$this->logger    = $logger;
	}

	/**
	 * Runs this initializer.
	 *
	 * @throws \Exception When a migration errored.
	 *
	 * @return void
	 */
	public function initialize() {
		$this->run_migrations( 'free', Yoast_Model::get_table_name( 'migrations' ), \WPSEO_PATH . 'migrations' );
	}

	/**
	 * Initializes the migrations.
	 *
	 * @param string $name                  The name of the migration.
	 * @param string $migrations_table_name The migrations table name.
	 * @param string $migrations_directory  The migrations directory.
	 *
	 * @return bool True on success, false on failure.
	 * @throws \Exception If the migration fails and YOAST_ENVIRONMENT is not production.
	 */
	public function run_migrations( $name, $migrations_table_name, $migrations_directory ) {
		try {
			$framework_runner = $this->framework->get_framework_runner( $migrations_table_name, $migrations_directory );
			/**
			 * This variable represents Ruckusing_Adapter_MySQL_Base adapter.
			 *
			 * @var \YoastSEO_Vendor\Ruckusing_Adapter_MySQL_Base $adapter
			 */
			$adapter = $framework_runner->get_adapter();

			// Create our own migrations table with a 191 string limit to support older versions of MySQL.
			// Run this before calling the framework runner so it doesn't create it's own.
			if ( ! $adapter->has_table( $migrations_table_name ) ) {
				$table = $adapter->create_table( $migrations_table_name, [ 'id' => false ] );
				$table->column( 'version', 'string', [ 'limit' => 191 ] );
				$table->finish();
				$adapter->add_index( $migrations_table_name, 'version', [ 'unique' => true ] );
			}

			// Create our own task manager so we can set RUCKUSING_BASE to a nonsense directory as it's impossible to
			// determine the actual directory if the plugin is installed with composer.
			$task_manager = $this->framework->get_framework_task_manager( $adapter, $migrations_table_name, $migrations_directory );
			$task_manager->execute( $framework_runner, 'db:migrate', [] );
		}
		catch ( \Exception $exception ) {
			$this->logger->error( $exception->getMessage() );

			// Something went wrong...
			$this->set_failed_state( $name, $exception->getMessage() );

			if ( \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT !== 'production' ) {
				throw $exception;
			}

			return false;
		}

		$this->set_success_state( $name );

		return true;
	}

	/**
	 * Retrieves the state of the migrations.
	 *
	 * @param string $name The name of the migration.
	 *
	 * @return bool True if migrations have completed successfully.
	 */
	public function is_usable( $name ) {
		return ( $this->get_migration_state( $name ) === self::MIGRATION_STATE_SUCCESS );
	}

	/**
	 * Retrieves the state of the migrations.
	 *
	 * @param string $name The name of the migration.
	 *
	 * @return bool True if migrations have completed successfully.
	 */
	public function has_migration_error( $name ) {
		return ( $this->get_migration_state( $name ) === self::MIGRATION_STATE_ERROR );
	}

	/**
	 * Handles state persistence for a failed migration environment.
	 *
	 * @param string $name    The name of the migration.
	 * @param string $message Message explaining the reason for the failed state.
	 *
	 * @return void
	 */
	protected function set_failed_state( $name, $message ) {
		// @todo do something with the message.
		\set_transient( $this->get_error_transient_key( $name ), self::MIGRATION_STATE_ERROR, \DAY_IN_SECONDS );
	}

	/**
	 * Removes the problem state from the system.
	 *
	 * @param string $name The name of the migration.
	 *
	 * @return void
	 */
	protected function set_success_state( $name ) {
		\delete_transient( $this->get_error_transient_key( $name ) );
	}

	/**
	 * Retrieves the current migration state.
	 *
	 * @param string $name The name of the migration.
	 *
	 * @return int|null Migration state.
	 */
	protected function get_migration_state( $name ) {
		return \get_transient( $this->get_error_transient_key( $name ), self::MIGRATION_STATE_SUCCESS );
	}

	/**
	 * Retrieves the error state transient key to use.
	 *
	 * @param string $name The name of the migration.
	 *
	 * @return string The transient key to use for storing the error state.
	 */
	protected function get_error_transient_key( $name ) {
		return self::MIGRATION_ERROR_TRANSIENT_KEY . $name;
	}
}
