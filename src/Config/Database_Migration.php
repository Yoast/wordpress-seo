<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\Migration_Null_Logger;
use Yoast\YoastSEO\Prefix_Dependencies;
use Yoast\YoastSEO\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

class Database_Migration {
	/** @var \wpdb WPDB instance */
	protected $wpdb;

	/**
	 * Migrations constructor.
	 *
	 * @param \wpdb $wpdb
	 *
	 * @return void
	 */
	public function __construct( $wpdb ) {
		$this->wpdb = $wpdb;
	}

	/**
	 * Initializes the migrations.
	 *
	 * @return bool
	 */
	public function initialize() {
		if ( '1' === get_transient( 'yoast_migration_problem' ) ) {
			return false;
		}

		// If the defines could not be set, we do not want to run.
		if ( ! $this->set_defines( Yoast_Model::get_table_name( 'migrations' ) ) ) {
			$this->set_failed_state( 'Defines could not be set.' );

			return false;
		}

		$this->prefix_dependencies();

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
		restore_error_handler();
		restore_exception_handler();

		try {
			$main->execute();
		} catch ( \Exception $exception ) {
			// Something went wrong...
			// Disable functionality?
			$this->set_failed_state( $exception->getMessage() );

			return false;
		}

		return true;
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
	 * Retrieves the database charset.
	 *
	 * @return string Charset configured for the database.
	 */
	protected function get_charset() {
		return $this->wpdb->charset;
	}

	/**
	 * Prefixes the dependencies.
	 *
	 * @return void
	 */
	protected function prefix_dependencies() {
		$ruckusing_classes = new ClassAliases\Ruckusing();
		$prefix            = new Prefix_Dependencies( YOAST_VENDOR_NS_PREFIX );
		$prefix->prefix( $ruckusing_classes->get_classes() );
	}

	/**
	 * @param $table_name
	 *
	 * @return bool
	 */
	protected function set_defines( $table_name ) {
		if ( $this->prefixed_available() ) {
			define( YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_BASE', WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/ruckusing' );
			define( YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_TS_SCHEMA_TBL_NAME', $table_name );

			return true;
		}

		if ( ! defined( 'RUCKUSING_BASE' ) ) {
			define( 'RUCKUSING_BASE', WPSEO_PATH . 'vendor/ruckusing/ruckusing-migrations' );
			define( 'RUCKUSING_TS_SCHEMA_TBL_NAME', $table_name );

			return true;
		}

		return false;
	}

	/**
	 * @return bool
	 */
	protected function prefixed_available() {
		return is_dir( WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/ruckusing' );
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
		set_transient( 'yoast_migration_problem', 1, DAY_IN_SECONDS );
	}
}
