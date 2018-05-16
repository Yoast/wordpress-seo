<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO
 */

namespace Yoast\YoastSEO;

use YoastSEO_Vendor\Model;
use YoastSEO_Vendor\ORMWrapper;

/**
 * Make Model compatible with WordPress.
 */
class Yoast_Model extends Model {
	/**
	 * The table name for the implemented Model.
	 *
	 * @var string $_table
	 */
	public static $_table;

	/**
	 * Hacks around the Model to provide WordPress prefix to tables.
	 *
	 * @param string $class_name   Type of Model to load.
	 * @param bool   $yoast_prefix Optional. True to prefix the table name with the Yoast prefix.
	 *
	 * @return ORMWrapper Wrapper to use.
	 */
	public static function of_type( $class_name, $yoast_prefix = true ) {
		// Prepend namespace to the class name.
		$class = self::$auto_prefix_models . $class_name;

		// Set the class variable to the custom value based on the WPDB prefix.
		$class::$_table = self::get_table_name( $class_name, $yoast_prefix );

		return parent::factory( $class_name, null );
	}

	/**
	 * Creates a model without the Yoast prefix.
	 *
	 * @param string $class_name Type of Model to load.
	 *
	 * @return ORMWrapper
	 */
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

	/**
	 * Helper method to manage one-to-many relations where the foreign
	 * key is on the associated table.
	 *
	 * @param  string      $associated_class_name                    Associated class name.
	 * @param  null|string $foreign_key_name                         Associated class name.
	 * @param  null|string $foreign_key_name_in_current_models_table Foreign key name in the current model.
	 * @param  null|string $connection_name                          Name of the connection.
	 *
	 * @return ORMWrapper The ORM object.
	 */
	protected function has_many( $associated_class_name, $foreign_key_name = null, $foreign_key_name_in_current_models_table = null, $connection_name = null ) {
		$this->set_table_name( $associated_class_name );

		return parent::has_many( $associated_class_name, $foreign_key_name, $foreign_key_name_in_current_models_table, $connection_name );
	}

	/**
	 * Helper method to manage one-to-one and one-to-many relations where
	 * the foreign key is on the base table.
	 *
	 * @param  string      $associated_class_name                       Associated class name.
	 * @param  null|string $foreign_key_name                            Foreign key name.
	 * @param  null|string $foreign_key_name_in_associated_models_table Foreign key name in the associated model.
	 * @param  null|string $connection_name                             Name of the connection.
	 *
	 * @return $this|null Current object or null.
	 */
	protected function belongs_to( $associated_class_name, $foreign_key_name = null, $foreign_key_name_in_associated_models_table = null, $connection_name = null ) {
		$this->set_table_name( $associated_class_name );

		return parent::belongs_to( $associated_class_name, $foreign_key_name, $foreign_key_name_in_associated_models_table, $connection_name );
	}

	/**
	 * Sets the table name for the given class name.
	 *
	 * @param string $class_name The class to set the table name for.
	 *
	 * @return void
	 */
	protected function set_table_name( $class_name ) {
		// Prepend namespace to the class name.
		$class = self::$auto_prefix_models . $class_name;

		$class::$_table = self::get_table_name( $class_name );
	}
}
