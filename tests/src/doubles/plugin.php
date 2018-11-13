<?php

namespace Yoast\Tests\Doubles;

class Plugin extends \Yoast\YoastSEO\Config\Plugin {

	/**
	 * Sets the value for the initialize success property
	 *
	 * @param mixed $value Value to set.
	 *
	 * @return void
	 */
	public function set_initialize_success( $value ) {
		$this->initialize_success = $value;
	}

	/**
	 * Retrieves the registered integrations
	 *
	 * @return array
	 */
	public function get_integrations() {
		return $this->integrations;
	}

	/**
	 * Retrieves the configured database migration instance.
	 *
	 * @return \Yoast\YoastSEO\Config\Database_Migration
	 */
	public function get_database_migration() {
		return $this->database_migration;
	}

	/**
	 * Retrieves the configured dependency management instance.
	 *
	 * @return \Yoast\YoastSEO\Config\Dependency_Management
	 */
	public function get_dependency_management() {
		return $this->dependency_management;
	}

	/**
	 * @inheritdoc
	 */
	public function add_frontend_integrations() {
		parent::add_frontend_integrations();
	}

	/**
	 * @inheritdoc
	 */
	public function add_admin_integrations() {
		parent::add_admin_integrations();
	}

	/**
	 * @inheritdoc
	 */
	public function get_integration_group( array $integrations = array() ) {
		return parent::get_integration_group( $integrations );
	}

	/**
	 * @inheritdoc
	 */
	public function is_admin() {
		return parent::is_admin();
	}

	/**
	 * @inheritdoc
	 */
	public function is_frontend() {
		return parent::is_frontend();
	}
}
