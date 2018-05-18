<?php
/**
 * The main plugin bootstrap.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\WordPress\Integration_Group;
use Yoast\YoastSEO\Yoast_Model;
use YoastSEO_Vendor\ORM;

/**
 * Bootstraps the plugin.
 */
class Plugin implements Integration {
	/**
	 * List of integrations.
	 *
	 * @var array $integrations
	 */
	protected $integrations = array();

	/**
	 * Flag to allow booting or not.
	 *
	 * @var bool $initialize_success
	 */
	protected $initialize_success = false;

	/**
	 * The dependency manager to use.
	 *
	 * @var Dependency_Management $dependency_management
	 */
	protected $dependency_management;

	/**
	 * The database migration to use.
	 *
	 * @var Database_Migration $database_migration
	 */
	protected $database_migration;

	/**
	 * Creates a new plugin instance.
	 *
	 * @param Dependency_Management|null $dependency_management Class to manage dependency prefixing.
	 * @param Database_Migration|null    $database_migration    Class to manage database migrations.
	 */
	public function __construct( Dependency_Management $dependency_management = null, Database_Migration $database_migration = null ) {
		// @codingStandardsIgnoreStart
		$this->dependency_management = $dependency_management ?: new Dependency_Management();
		$this->database_migration    = $database_migration ?: new Database_Migration( $GLOBALS['wpdb'], $this->dependency_management );
		// @codingStandardsIgnoreEnd
	}

	/**
	 * Adds an integration to the stack
	 *
	 * @param Integration $integration Integration to add.
	 *
	 * @return void
	 */
	public function add_integration( Integration $integration ) {
		$this->integrations[] = $integration;
	}

	/**
	 * Initializes the plugin.
	 *
	 * @return void
	 */
	public function initialize() {
		// ORM can only be configured after dependency management is loaded.
		if ( ! $this->dependency_management->initialize() ) {
			return;
		}

		$this->configure_orm();

		// When the database migrations are not applied correctly yet, try running them.
		if ( ! $this->database_migration->is_usable() ) {
			$this->database_migration->run_migrations();
		}

		// Everything is loaded, set initialize state.
		$this->initialize_success = ! $this->database_migration->has_migration_error();
	}

	/**
	 * Registers the hooks for all registered integrations.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->initialize_success ) {
			return;
		}

		$this->add_integration( new Upgrade( $this->database_migration ) );

		if ( $this->is_admin() ) {
			$this->add_admin_integrations();
		}

		if ( $this->is_frontend() ) {
			$this->add_frontend_integrations();
		}

		$this->trigger_integration_hook();

		$integration_group = $this->get_integration_group( $this->integrations );
		$integration_group->register_hooks();
	}

	/**
	 * Wraps the WordPress is_admin function.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	protected function is_admin() {
		return is_admin();
	}

	/**
	 * Wraps the WordPress is_admin function.
	 *
	 * @return bool
	 */
	protected function is_frontend() {
		return ! is_admin();
	}

	/**
	 * Adds the required frontend integrations.
	 *
	 * @return void
	 */
	protected function add_frontend_integrations() {
		$this->add_integration( new Frontend() );
	}

	/**
	 * Adds the required frontend integrations.
	 *
	 * @return void
	 */
	protected function add_admin_integrations() {
		$this->add_integration( new Admin() );
	}

	/**
	 * Configures the ORM.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function configure_orm() {
		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Yoast_Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';
	}

	/**
	 * Retrieves an integration group.
	 *
	 * @param array $integrations Integrations to load into the group.
	 *
	 * @return Integration_Group.
	 */
	protected function get_integration_group( array $integrations = array() ) {
		return new Integration_Group( $integrations );
	}

	/**
	 * Triggers a WordPress action to allow integrations to register themselves.
	 *
	 * @return void
	 */
	protected function trigger_integration_hook() {
		/**
		 * Action: 'wpseo_load_integrations' - Hook to register additional Yoast SEO Integrations.
		 *
		 * @api \Yoast\YoastSEO\Config\Plugin The Plugin object to register integrations on.
		 */
		do_action( 'wpseo_load_integrations', $this );
	}
}
