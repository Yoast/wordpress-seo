<?php

namespace Yoast\YoastSEO;

use Model;

class Yoast_Model extends Model {
	public static $_table;

	/**
	 * Hacks around the Model to provide WordPress prefix to tables.
	 *
	 * @param string $class_name
	 * @param null   $connection_name
	 *
	 * @return \ORMWrapper
	 */
	public static function of_type( $class_name, $connection_name = null ) {
		// Prepend namespace to the class name.
		$class = self::$auto_prefix_models . $class_name;

		// Set the class variable to the custom value based on the WPDB prefix.
		$class::$_table = self::get_table_name( $class_name );

		return parent::factory( $class_name, $connection_name );
	}

	/**
	 * Exposes method to get the table name to use.
	 *
	 * @param string $table_name Simple table name.
	 *
	 * @return string Prepared full table name.
	 */
	public static function get_table_name( $table_name ) {
		global $wpdb;

		return $wpdb->prefix . 'yoast_' . strtolower( $table_name );
	}
}
