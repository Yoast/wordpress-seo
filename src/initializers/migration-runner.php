<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Initializers;

use Exception;
use Yoast\WP\Lib\Migrations\Adapter;
use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Loader;

/**
 * Triggers database migrations and handles results.
 */
class Migration_Runner implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * The migrations adapter.
	 *
	 * @var Adapter
	 */
	protected $adapter;

	/**
	 * The loader.
	 *
	 * @var Loader
	 */
	protected $loader;

	/**
	 * The migration status.
	 *
	 * @var Migration_Status
	 */
	protected $migration_status;

	/**
	 * Retrieves the conditionals for the migrations.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Migrations constructor.
	 *
	 * @param Migration_Status $migration_status The migration status.
	 * @param Loader           $loader           The loader.
	 * @param Adapter          $adapter          The migrations adapter.
	 */
	public function __construct(
		Migration_Status $migration_status,
		Loader $loader,
		Adapter $adapter
	) {
		$this->migration_status = $migration_status;
		$this->loader           = $loader;
		$this->adapter          = $adapter;
	}

	/**
	 * Runs this initializer.
	 *
	 * @throws Exception When a migration errored.
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
	 * @throws Exception When a migration errored.
	 *
	 * @return void
	 */
	public function run_free_migrations() {
		$this->run_migrations( 'free' );
	}

	/**
	 * Initializes the migrations.
	 *
	 * @param string $name The name of the migration.
	 *
	 * @return bool True on success, false on failure.
	 *
	 * @throws Exception If the migration fails and YOAST_ENVIRONMENT is not production.
	 */
	public function run_migrations( $name ) {
		if ( ! $this->migration_status->should_run_migration( $name ) ) {
			return true;
		}

		if ( ! $this->migration_status->lock_migration( $name ) ) {
			return false;
		}

		$migrations = $this->loader->get_migrations( $name );

		if ( $migrations === false ) {
			$this->migration_status->set_error( $name, "Could not perform $name migrations. No migrations found." );
			return false;
		}

		try {
			$this->adapter->create_schema_version_table();
			$all_versions      = \array_keys( $migrations );
			$migrated_versions = $this->adapter->get_migrated_versions();
			$to_do_versions    = \array_diff( $all_versions, $migrated_versions );

			\sort( $to_do_versions, SORT_STRING );

			foreach ( $to_do_versions as $version ) {
				$class = $migrations[ $version ];
				$this->run_migration( $version, $class );
			}
		} catch ( Exception $exception ) {
			// Something went wrong...
			$this->migration_status->set_error( $name, $exception->getMessage() );

			if ( \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT !== 'production' ) {
				throw $exception;
			}

			return false;
		}

		$this->migration_status->set_success( $name );

		return true;
	}

	/**
	 * Runs a single migration.
	 *
	 * @param string $version The version.
	 * @param string $class   The migration class.
	 *
	 * @return void
	 *
	 * @throws Exception If the migration failed. Caught by the run_migrations function.
	 */
	protected function run_migration( $version, $class ) {
		/**
		 * @var Migration
		 */
		$migration = new $class( $this->adapter );
		try {
			$this->adapter->start_transaction();
			$migration->up();
			$this->adapter->add_version( $version );
			$this->adapter->commit_transaction();
		} catch ( Exception $e ) {
			$this->adapter->rollback_transaction();
			throw new Exception( \sprintf( '%s - %s', $class, $e->getMessage() ), 0, $e );
		}
	}
}
