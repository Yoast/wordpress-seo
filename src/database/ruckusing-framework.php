<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Database;

use wpdb;
use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Loggers\Migration_Logger;
use Yoast\WP\Free\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

class Ruckusing_Framework {

	/**
	 * Retrieves the Ruckusing instance to run migrations with.
	 *
	 * @return \YoastSEO_Vendor\Ruckusing_FrameworkRunner Framework runner to use.
	 */
	public static function get_instance(
		wpdb $wpdb,
		Dependency_Management $dependency_management,
		Migration_Logger $logger
	) {
		// First set the required constants.
		self::set_constants( $dependency_management, Yoast_Model::get_table_name( 'migrations' ) );

		$configuration = [
			'db'             => [
				'production' => [
					'type'      => 'mysql',
					'host'      => \DB_HOST,
					'port'      => 3306,
					'database'  => \DB_NAME,
					'user'      => \DB_USER,
					'password'  => \DB_PASSWORD,
					'charset'   => $wpdb->charset,
					'directory' => '', // This needs to be set, to use the migrations folder as base folder.
				],
			],
			'migrations_dir' => [ 'default' => \WPSEO_PATH . 'migrations' ],
			// This needs to be set but is not used.
			'db_dir'         => true,
			// This needs to be set but is not used.
			'log_dir'        => true,
			// This needs to be set but is not used.
		];

		$instance = new Ruckusing_FrameworkRunner( $configuration, [ 'db:migrate', 'env=production' ], $logger );

		/*
		 * As the Ruckusing_FrameworkRunner is setting its own error and exception handlers,
		 * we need to restore the defaults.
		 */
		\restore_error_handler();
		\restore_exception_handler();

		return $instance;
	}

	/**
	 * Registers defines needed for Ruckusing to work.
	 *
	 * @param Dependency_Management $dependency_management Dependency management to chech whether or not vendor_prefixed is used.
	 * @param string                $table_name            The Schema table name to use.
	 *
	 * @return bool True on success, false when the defines are already set.
	 */
	protected static function set_constants( Dependency_Management $dependency_management, $table_name ) {
		foreach ( self::get_constants( $dependency_management, $table_name ) as $key => $value ) {
			if ( ! self::set_constant( $key, $value ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Registers a define or makes sure the existing value is the one we can use.
	 *
	 * @param string $define Constant to check.
	 * @param string $value  Value to set when not defined yet.
	 *
	 * @return bool True if the define has the value we want it to be.
	 */
	protected static function set_constant( $define, $value ) {
		if ( \defined( $define ) ) {
			return \constant( $define ) === $value;
		}

		return \define( $define, $value );
	}

	/**
	 * Retrieves a list of defines that should be set.
	 *
	 * @param Dependency_Management $dependency_management Dependency management to chech whether or not vendor_prefixed is used.
	 * @param string                $table_name            Table name to use.
	 *
	 * @return array List of defines to be set.
	 */
	protected static function get_constants( Dependency_Management $dependency_management, $table_name ) {
		if ( $dependency_management->prefixed_available() ) {
			return [
				\YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_BASE' => \WPSEO_PATH . \YOAST_VENDOR_PREFIX_DIRECTORY . '/ruckusing',
				\YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_TS_SCHEMA_TBL_NAME' => $table_name,
			];
		}

		return [
			'RUCKUSING_BASE'               => \WPSEO_PATH . 'vendor/ruckusing/ruckusing-migrations',
			'RUCKUSING_TS_SCHEMA_TBL_NAME' => $table_name,
		];
	}
}
