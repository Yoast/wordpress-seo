<?php

namespace Yoast\YoastSEO;

use YoastSEO_Vendor\Model;
use YoastSEO_Vendor\ORMWrapper;

class Yoast_Model extends Model {
	public static $_table;

	/**
	 * Hacks around the Model to provide WordPress prefix to tables.
	 *
	 * @param string $class_name
	 * @param bool   $yoast_prefix Optional. True to prefix the table name with the Yoast prefix.
	 *
	 * @return ORMWrapper
	 */
	public static function of_type( $class_name, $yoast_prefix = true ) {
		// Prepend namespace to the class name.
		$class = self::$auto_prefix_models . $class_name;

		// Set the class variable to the custom value based on the WPDB prefix.
		$class::$_table = self::get_table_name( $class_name, $yoast_prefix );

		return parent::factory( $class_name, null );
	}

	public static function of_wp_type( $class_name ) {
		return self::of_type( $class_name, false );
	}

	/**
	 * Exposes method to get the table name to use.
	 *
	 * @param string $table_name   Simple table name.
	 * @param bool   $yoast_prefix Optional. True to prefix the table name with the Yoast prefix.
	 *
	 * @return string Prepared full table name.
	 */
	public static function get_table_name( $table_name, $yoast_prefix = true ) {
		global $wpdb;

		// Allow the use of WordPress internal tables.
		if ( $yoast_prefix ) {
			$table_name = 'yoast_' . $table_name;
		}

		return $wpdb->prefix . strtolower( $table_name );
	}
}
