<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Database;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\WordPress\Initializer;
use Yoast\WP\Free\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

/**
 * Triggers database migrations and handles results.
 */
class Migration_Runner implements Initializer {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

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
	 * @var \YoastSEO_Vendor\Ruckusing_FrameworkRunner
	 */
	protected $framework_runner;

	/**
	 * @var \Yoast\WP\Free\Loggers\Logger
	 */
	protected $logger;

	/**
	 * Migrations constructor.
	 *
	 * @param Ruckusing_FrameworkRunner $framework_runner      The Ruckusing framework runner.
	 * @param Logger                    $logger                A PSR compatible logger.
	 */
	public function __construct( Ruckusing_FrameworkRunner $framework_runner, Logger $logger ) {
		$this->framework_runner      = $framework_runner;
		$this->logger                = $logger;
	}

	/**
	 * @inheritdoc
	 */
	public function initialize() {
		$this->run_migrations();
	}

	/**
	 * Initializes the migrations.
	 *
	 * @throws \Exception If the migration fails and YOAST_ENVIRONMENT is not production.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function run_migrations() {
		try {
			/**
			 * @var \YoastSEO_Vendor\Ruckusing_Adapter_MySQL_Base $adapter
			 */
			$adapter = $this->framework_runner->get_adapter();

			// Create our own migrations table with a 191 string limit to support older versions of MySQL.
			// Run this before calling the framework runner so it doesn't create it's own.
			$migrations_table_name = $adapter->get_schema_version_table_name();
			if ( ! $adapter->has_table( $migrations_table_name ) ) {
				$table = $adapter->create_table( $migrations_table_name, [ 'id' => false ] );
				$table->column( 'version', 'string', [ 'limit' => 191 ] );
				$table->finish();
				$adapter->add_index( $migrations_table_name, 'version', [ 'unique' => true ] );
			}

			$this->framework_runner->execute();
		}
		catch ( \Exception $exception ) {
			$this->logger->error( $exception->getMessage() );

			// Something went wrong...
			$this->set_failed_state( $exception->getMessage() );

			if ( defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT !== 'production' ) {
				throw $exception;
			}

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
	 * Retrieves the error state transient key to use.
	 *
	 * @return string The transient key to use for storing the error state.
	 */
	protected function get_error_transient_key() {
		return self::MIGRATION_ERROR_TRANSIENT_KEY;
	}
}
