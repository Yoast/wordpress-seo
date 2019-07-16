<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Database;

use Yoast\WP\Free\Conditionals\Admin_Conditional;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\ORM\Yoast_Model;
use Yoast\WP\Free\WordPress\Initializer;
/**
 * Triggers database migrations and handles results.
 */
class Migration_Runner implements Initializer {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class, Admin_Conditional::class ];
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
	const MIGRATION_ERROR_TRANSIENT_KEY = 'yoast_migration_problem_';

	/**
	 * @var string
	 */
	const MIGRATION_OPTION_KEY = 'yoast_migrations_';

	/**
	 * @var Ruckusing_Framework
	 */
	protected $framework;

	/**
	 * @var \Yoast\WP\Free\Loggers\Logger
	 */
	protected $logger;

	/**
	 * @var \Yoast\WP\Free\Database\Migration_Status
	 */
	protected $migration_status;

	/**
	 * Migrations constructor.
	 *
	 * @param \Yoast\WP\Free\Database\Migration_Status    $migration_status
	 * @param \Yoast\WP\Free\Database\Ruckusing_Framework $framework The Ruckusing framework runner.
	 * @param \Yoast\WP\Free\Loggers\Logger               $logger    A PSR compatible logger.
	 */
	public function __construct(
		Migration_Status    $migration_status,
		Ruckusing_Framework $framework,
		Logger              $logger
	) {
		$this->migration_status = $migration_status;
		$this->framework        = $framework;
		$this->logger           = $logger;
	}

	/**
	 * @inheritdoc
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
	 *
	 * @throws \Exception If the migration fails and YOAST_ENVIRONMENT is not production.
	 */
	public function run_migrations( $name, $migrations_table_name, $migrations_directory ) {
		if ( ! $this->migration_status->should_run_migration( $name ) ) {
			return true;
		}

		if ( ! $this->migration_status->lock_migration( $name ) ) {
			return false;
		}

		try {
			$framework_runner = $this->framework->get_framework_runner( $migrations_table_name, $migrations_directory );
			/**
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
		} catch ( \Exception $exception ) {
			$this->logger->error( $exception->getMessage() );

			// Something went wrong...
			$this->migration_status->set_error( $name, $exception->getMessage() );

			if ( defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT !== 'production' ) {
				throw $exception;
			}

			return false;
		}

		$this->migration_status->set_success( $name );

		return true;
	}
}
