<?php

namespace Yoast;

use Model;

class Yoast_Model extends Model {
	/**
	 * Hacks around the Model to provide WordPress prefix to tables.
	 *
	 * @param string $class_name
	 * @param null   $connection_name
	 *
	 * @return \ORMWrapper
	 */
	public static function factory($class_name, $connection_name = null) {
		global $wpdb;

		$class = self::$auto_prefix_models . $class_name;
		$class::$_table = $wpdb->prefix . 'yoast_' . strtolower( $class_name );

		return parent::factory( $class_name, $connection_name );
	}
}
