<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the state of the table being accessible.
 */
class WPSEO_Link_Table_Accessible {

	/**
	 * Checks if the given table name exists.
	 *
	 * @return bool True when table is accessible.
	 */
	public static function is_accessible() {
		$value = get_transient( 'wpseo_link_table_inaccessible' );

		// If the value is not set, check the table.
		if ( $value === false ) {
			return self::check_table();
		}

		return $value === '0';
	}

	/**
	 * Sets the transient value to 1, to indicate the table is not accessible.
	 *
	 * @return void
	 */
	public static function set_inaccessible() {
		set_transient( 'wpseo_link_table_inaccessible', '1', HOUR_IN_SECONDS );
	}

	/**
	 * Removes the transient.
	 *
	 * @return void
	 */
	public static function clear() {
		delete_transient( 'wpseo_link_table_inaccessible' );
	}

	/**
	 * Checks if the table exists if not, set the transient to indicate the inaccessible table.
	 *
	 * @return bool True if table is accessible.
	 */
	protected static function check_table() {
		global $wpdb;

		$storage = new WPSEO_Link_Storage();
		$query   = $wpdb->prepare( 'SHOW TABLES LIKE %s', $storage->get_table_name() );
		if ( $wpdb->get_var( $query ) !== $storage->get_table_name() ) {
			self::set_inaccessible();
			return false;
		}

		/*
		 * Prefer to set a 0 timeout, but if the timeout was set before WordPress will not delete the transient
		 * correctly when overridden with a zero value.
		 *
		 * Setting a YEAR_IN_SECONDS instead.
		 */
		set_transient( 'wpseo_link_table_inaccessible', '0', YEAR_IN_SECONDS );
		return true;
	}
}
