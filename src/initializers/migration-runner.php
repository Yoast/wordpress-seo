<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Initializers;

use Exception;
use Yoast\WP\SEO\Config\Ruckusing_Framework;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Triggers database migrations and handles results.
 */
class Migration_Runner implements Initializer_Interface {

	/**
	 * Retrieves the conditionals for the migrations.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * The Ruckusing framework runner.
	 *
	 * @var Ruckusing_Framework
	 */
	protected $framework;

	/**
	 * The logger object.
	 *
	 * @var Logger
	 */
	protected $logger;

	/**
	 * The migration status.
	 *
	 * @var Migration_Status
	 */
	protected $migration_status;

	/**
	 * The database setup object.
	 *
	 * @var Database_Setup
	 */
	protected $database_setup;

	/**
	 * Migrations constructor.
	 *
	 * @param Migration_Status    $migration_status The migration status.
	 * @param Ruckusing_Framework $framework        The Ruckusing framework runner.
	 * @param Logger              $logger           A PSR compatible logger.
	 * @param Database_Setup      $database_setup   The database setup.
	 */
	public function __construct(
		Migration_Status $migration_status,
		Ruckusing_Framework $framework,
		Logger $logger,
		Database_Setup $database_setup
	) {
		$this->migration_status = $migration_status;
		$this->framework        = $framework;
		$this->logger           = $logger;
		$this->database_setup   = $database_setup;
	}

	/**
	 * Runs this initializer.
	 *
	 * @throws \Exception When a migration errored.
	 *
	 * @return void
	 */
	public function initialize() {
		$this->run_free_migrations();
		// The below actions is used for when queries fail, this may happen in a multisite environment when switch_to_blog is used.
		\add_action( '_yoast_run_migrations', [ $this, 'run_free_migrations' ] );
	}

	/**
	 * Runs the free migrations.
	 *
	 * @throws \Exception When a migration errored.
	 *
	 * @return void
	 */
	public function run_free_migrations() {
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
			$database_config = $this->database_setup->get_database_config();
			if ( ! empty( $database_config['socket'] ) ) {
				// Temporarily set the defined socket as the default as we can't pass it to ruckusing.
				$old_mysqli_socket = @ini_set( 'mysqli.default_socket', $database_config['socket'] );
			}

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
		} catch ( Exception $exception ) {
			$this->logger->error( $exception->getMessage() );

			// Something went wrong...
			$this->migration_status->set_error( $name, $exception->getMessage() );

			if ( \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT !== 'production' ) {
				throw $exception;
			}

			return false;
		} finally {
			if ( isset( $old_mysqli_socket ) && $old_mysqli_socket !== false ) {
				// Always restore the old default if it was overwritten.
				@ini_set( 'mysqli.default_socket', $old_mysqli_socket );
			}
		}

		$this->migration_status->set_success( $name );

		return true;
	}
}
