<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\Migration_Null_Logger;
use Yoast\YoastSEO\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

class Database_Migration {
	const MIGRATION_STATE_SUCCESS = 0;
	const MIGRATION_STATE_ERROR = 1;

	/** @var \wpdb WPDB instance */
	protected $wpdb;

	/** @var Dependency_Management */
	protected $dependency_management;

	/**
	 * Migrations constructor.
	 *
	 * @param \wpdb                 $wpdb                  Database class to use.
	 * @param Dependency_Management $dependency_management Dependency Management to use.
	 */
	public function __construct( $wpdb, Dependency_Management $dependency_management ) {
		$this->wpdb                  = $wpdb;
		$this->dependency_management = $dependency_management;
	}

	/**
	 * Initializes the migrations.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function initialize() {
		if ( $this->get_migration_state() === self::MIGRATION_STATE_ERROR ) {
			return false;
		}

		// If the defines could not be set, we do not want to run.
		if ( ! $this->set_defines( Yoast_Model::get_table_name( 'migrations' ) ) ) {
			$this->set_failed_state( 'Defines could not be set.' );

			return false;
		}

		try {
			$main = $this->get_framework_runner();
			$main->execute();

		} catch ( \Exception $exception ) {
			// Something went wrong...
			$this->set_failed_state( $exception->getMessage() );

			return false;
		}

		$this->set_success_state();

		return true;
	}

	/**
	 * Retrieves the database charset.
	 *
	 * @return string Charset configured for the database.
	 */
	protected function get_charset() {
		return $this->wpdb->charset;
	}

	/**
	 * Registers defines needed for Ruckusing to work.
	 *
	 * @param string $table_name The Schema table name to use.
	 *
	 * @return bool True on success, false when the defines are already set.
	 */
	protected function set_defines( $table_name ) {
		foreach ( $this->get_defines( $table_name ) as $key => $value ) {
			if ( ! $this->set_define( $key, $value ) ) {
				return false;
			}
		}

		return true;
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
		\set_transient( 'yoast_migration_problem', self::MIGRATION_STATE_ERROR, DAY_IN_SECONDS );
	}

	/**
	 * Removes the problem state from the system.
	 *
	 * @return void
	 */
	protected function set_success_state() {
		\delete_transient( 'yoast_migration_problem' );
	}

	/**
	 * Retrieves the current migration state.
	 *
	 * @return int Migration state.
	 */
	protected function get_migration_state() {
		return (int) \get_transient( 'yoast_migration_problem' );
	}

	/**
	 * Retrieves the Ruckusing instance to run migrations with.
	 *
	 * @return Ruckusing_FrameworkRunner
	 */
	protected function get_framework_runner() {
		$main = new Ruckusing_FrameworkRunner(
			$this->get_configuration(),
			array(
				'db:migrate',
				'env=production'
			),
			new Migration_Null_Logger()
		);

		/*
		 * As the Ruckusing_FrameworkRunner is setting its own error and exception handlers,
		 * we need to restore the defaults.
		 */
		\restore_error_handler();
		\restore_exception_handler();

		return $main;
	}

	/**
	 * Retrieves the migration configuration.
	 *
	 * @return array List of configuration elements.
	 */
	protected function get_configuration() {
		return array(
			'db'             => array(
				'production' => array(
					'type'      => 'mysql',
					'host'      => DB_HOST,
					'port'      => 3306,
					'database'  => DB_NAME,
					'user'      => DB_USER,
					'password'  => DB_PASSWORD,
					'charset'   => $this->get_charset(),
					'directory' => '', // This needs to be set, to use the migrations folder as base folder.
				),
			),
			'migrations_dir' => array( 'default' => WPSEO_PATH . 'migrations' ),
			// This needs to be set but is not used.
			'db_dir'         => true,
			// This needs to be set but is not used.
			'log_dir'        => true,
			// This needs to be set but is not used.
		);
	}

	/**
	 * Registers a define or makes sure the existing value is the one we can use.
	 *
	 * @return bool True if the define has the value we want it to be.
	 */
	protected function set_define( $define, $value ) {
		if ( defined( $define ) ) {
			return constant( $define ) === $value;
		}

		return define( $define, $value );
	}

	/**
	 * Retrieves a list of defines that should be set.
	 *
	 * @param string $table_name Table name to use.
	 *
	 * @return array List of defines to be set.
	 */
	protected function get_defines( $table_name ) {
		if ( $this->dependency_management->prefixed_available() ) {
			return array(
				YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_BASE'               => WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/ruckusing',
				YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_TS_SCHEMA_TBL_NAME' => $table_name
			);
		}

		return array(
			'RUCKUSING_BASE'               => WPSEO_PATH . 'vendor/ruckusing/ruckusing-migrations',
			'RUCKUSING_TS_SCHEMA_TBL_NAME' => $table_name
		);
	}
}
