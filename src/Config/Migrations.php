<?php

namespace Yoast\YoastSEO\Config;

use Ruckusing_FrameworkRunner;
use Yoast\YoastSEO\Migration_Null_Logger;
use Yoast\YoastSEO\Yoast_Model;

class Migrations {
	/** @var \wpdb WPDB instance */
	protected $wpdb;

	/**
	 * Migrations constructor.
	 *
	 * @param \wpdb $wpdb
	 */
	public function __construct( $wpdb ) {
		$this->wpdb = $wpdb;
	}

	/**
	 * Initializes the migrations.
	 */
	public function initialize() {
		// @todo evaluate prefixing approach for global constants.
		define( 'RUCKUSING_BASE', WPSEO_PATH . '/vendor/ruckusing/ruckusing-migrations' );
		define( 'RUCKUSING_TS_SCHEMA_TBL_NAME', Yoast_Model::get_table_name( 'migrations' ) );

		$main = new Ruckusing_FrameworkRunner( $this->get_configuration(), array(
			'db:migrate',
			'env=production'
		), new Migration_Null_Logger() );
		$main->execute();

		/*
		 * As the Ruckusing_FrameworkRunner is setting its own error and exception handlers,
		 * we need to restore the defaults.
		 */
		restore_error_handler();
		restore_exception_handler();
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
}
