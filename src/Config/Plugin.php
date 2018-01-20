<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\Prefix_Dependencies;
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
		$dependency_management = $this->get_dependency_management();
		$dependency_management->initialize();

		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';

		$migration                = new Database_Migration( $GLOBALS['wpdb'] );
		$this->initialize_success = $migration->initialize();
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

		if ( is_admin() ) {
			$this->add_integration( new Admin() );
		}

		if ( ! is_admin() ) {
			$this->add_integration( new Frontend() );
		}

		/**
		 * Action: 'wpseo_load_integrations' - Hook to register additional Yoast SEO Integrations.
		 *
		 * @api \Yoast\YoastSEO\Config\Plugin The Plugin object to register integrations on.
		 */
		do_action( 'wpseo_load_integrations', $this );

		$integration_group = new Integration_Group( $this->integrations );
		$integration_group->register_hooks();
	}

	/**
	 * @param Dependency_Management $dependency_management
	 */
	public function set_dependecy_management( Dependency_Management $dependency_management = null ) {
		if ( $dependency_management === null ) {
			$dependency_management = new Dependency_Management();
		}

		$this->dependency_management = $dependency_management;
	}

	/**
	 * @return Dependency_Management
	 */
	protected function get_dependency_management() {
		if ( $this->dependency_management === null ) {
			$this->set_dependecy_management();
		}

		return $this->dependency_management;
	}
}
