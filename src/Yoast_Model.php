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
		global $wpdb;

		// Prepend namespace to the class name.
		$class = self::$auto_prefix_models . $class_name;

		// Set the class variable to the custom value based on the WPDB prefix.
		$class::$_table = $wpdb->prefix . 'yoast_' . strtolower( $class_name );

		// Proceed normally.
		return parent::factory( $class_name, $connection_name );
	}
}
