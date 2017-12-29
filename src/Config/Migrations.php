<?php

namespace Yoast\YoastSEO\Config;

use Ruckusing_FrameworkRunner;
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
	 *
	 */
	public function initialize() {
		// @todo evaluate prefixing approach for global constants.
		define( 'RUCKUSING_BASE', WPSEO_PATH . '/vendor/ruckusing/ruckusing-migrations' );
		define( 'RUCKUSING_TS_SCHEMA_TBL_NAME', Yoast_Model::get_table_name( 'migrations' ) );

		$main = new Ruckusing_FrameworkRunner( $this->get_configuration(), array( 'db:migrate', 'env=development' ) );
		$main->execute();

		restore_error_handler();
		restore_exception_handler();
	}

	/**
	 * @return array
	 */
	protected function get_configuration() {
		return array(
			'db'             => array(
				'development' => array(
					'type'     => 'mysql',
					'host'     => DB_HOST,
					'port'     => 3306,
					'database' => DB_NAME,
					'user'     => DB_USER,
					'password' => DB_PASSWORD,
					'charset'  => $this->get_charset(),
					'directory' => '',
				),
			),
			'migrations_dir' => array( 'default' => WPSEO_PATH . 'migrations' ),
			'db_dir'         => WPSEO_PATH . 'db',
			'log_dir'        => WPSEO_PATH . 'logs',
		);
	}

	/**
	 * @return mixed
	 */
	protected function get_charset() {
		return $this->wpdb->charset;
	}
}
