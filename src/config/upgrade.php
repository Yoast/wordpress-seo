<?php
/**
 * Handles upgrade routines.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Config;

use Yoast\WP\Free\WordPress\Integration;

/**
 * Triggers migrations and other upgrades.
 */
class Upgrade implements Integration {

	/**
	 * The database migration to use.
	 *
	 * @var \Yoast\WP\Free\Config\Database_Migration $database_migration
	 */
	protected $database_migration;

	/**
	 * Upgrade constructor.
	 *
	 * @param \Yoast\WP\Free\Config\Database_Migration $database_migration Database Migration to use.
	 */
	public function __construct( Database_Migration $database_migration ) {
		$this->database_migration = $database_migration;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_run_upgrade', array( $this, 'do_upgrade' ) );
	}

	/**
	 * Handles upgrade trigger.
	 *
	 * @param string $version Version that we are upgrading from.
	 *
	 * @return void
	 */
	public function do_upgrade( $version ) {
		$this->database_migration->run_migrations();
	}
}
