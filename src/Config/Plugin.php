<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\WordPress\Integration_Group;
use YoastSEO_Vendor\Model;
use YoastSEO_Vendor\ORM;

class Plugin implements Integration {
	/** @var array List of integrations. */
	protected $integrations = array();

	/** @var bool Flag to allow booting or not. */
	protected $initialize_success = false;

	/** @var Dependency_Management */
	protected $dependency_management;

	/** @var Database_Migration */
	protected $database_migration;

	/**
	 * Creates a new plugin instance.
	 *
	 * @param Dependency_Management|null $dependency_management Class to manage dependency prefixing.
	 * @param Database_Migration|null    $database_migration    Class to manage database migrations.
	 */
	public function __construct( Dependency_Management $dependency_management = null, Database_Migration $database_migration = null ) {
		if ( $dependency_management === null ) {
			$dependency_management = new Dependency_Management();
		}

		if ( $database_migration === null ) {
			$database_migration = new Database_Migration( $GLOBALS['wpdb'], $dependency_management );
		}

		$this->dependency_management = $dependency_management;
		$this->database_migration    = $database_migration;
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
		$dependency_success = $this->dependency_management->initialize();

		// ORM can only be configured after dependency management is loaded.
		if ( ! $dependency_success ) {
			return;
		}

		$this->configure_orm();

		// Everything is loaded, set initialize state.
		$this->initialize_success = $this->database_migration->initialize();
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
	 * @return bool
	 */
	protected function is_admin() {
		return is_admin();
	}

	/**
	 * @return bool
	 */
	protected function is_frontend() {
		return ! is_admin();
	}

	/**
	 * @return void
	 */
	protected function add_frontend_integrations() {
		$this->add_integration( new Frontend() );
	}

	/**
	 * @return void
	 */
	protected function add_admin_integrations() {
		$this->add_integration( new Admin() );
	}

	/**
	 * @return void
	 */
	protected function configure_orm() {
		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';
	}

	/**
	 * Retrieves an integration group.
	 *
	 * @param array $integrations
	 *
	 * @return Integration_Group
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
