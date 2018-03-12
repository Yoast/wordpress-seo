<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Plugin_Importer
 *
 * Class with functionality to import Yoast SEO settings from other plugins.
 */
abstract class WPSEO_Plugin_Importer {
	/**
	 * Holds the import status object.
	 *
	 * @var WPSEO_Import_Status
	 */
	protected $status;
	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $wpdb;
	/**
	 * @var string The plugin name.
	 */
	protected $plugin_name;
	/**
	 * @var string Meta key, used in like clause for detect query.
	 */
	protected $meta_key;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	/**
	 * Returns the string for the plugin we're importing from.
	 *
	 * @return string Plugin name.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Imports the settings and post meta data from another SEO plugin.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function run_import() {
		$this->status = new WPSEO_Import_Status( 'import', false );

		if ( ! $this->detect() ) {
			return $this->status;
		}

		$this->import();

		return $this->status->set_status( true );
	}

	/**
	 * Handles post meta data to import.
	 *
	 * @return void
	 */
	abstract protected function import();

	/**
	 * Removes the plugin data from the database.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function run_cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );

		if ( ! $this->detect() ) {
			return $this->status;
		}

		$this->cleanup();

		return $this->status->set_status( true );
	}

	/**
	 * Removes the plugin data from the database.
	 *
	 * @return void
	 */
	protected function cleanup() {
		$this->wpdb->query( $this->wpdb->prepare( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE %s", $this->meta_key ) );
	}

	/**
	 * Detects whether an import for this plugin is needed.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function run_detect() {
		$this->status = new WPSEO_Import_Status( 'detect', false );

		if ( ! $this->detect() ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return bool Boolean indicating whether there is something to import.
	 */
	protected function detect() {
		$result = $this->wpdb->get_var( $this->wpdb->prepare( "SELECT COUNT(*) AS `count` FROM {$this->wpdb->postmeta} WHERE meta_key LIKE %s", $this->meta_key ) );
		if ( $result === '0' ) {
			return false;
		}

		return true;
	}

	/**
	 * Helper function to clone meta keys and (optionally) change their values in bulk.
	 *
	 * @param string $old_key        The existing meta key.
	 * @param string $new_key        The new meta key.
	 * @param array  $replace_values An array, keys old value, values new values.
	 *
	 * @return void
	 */
	protected function meta_key_clone( $old_key, $new_key, $replace_values = array() ) {
		// First we create a temp table with all the values for meta_key.
		$this->wpdb->query( $this->wpdb->prepare( "CREATE TEMPORARY TABLE tmp_meta_table SELECT * FROM {$this->wpdb->postmeta} WHERE meta_key = %s", $old_key ) );

		// We set meta_id to NULL so on re-insert into the postmeta table, MYSQL can set new meta_id's and we don't get duplicates.
		$this->wpdb->query( "UPDATE tmp_meta_table SET meta_id = NULL" );

		// Now we rename the meta_key.
		$this->wpdb->query( $this->wpdb->prepare( "UPDATE tmp_meta_table SET meta_key = %s", WPSEO_Meta::$meta_prefix . $new_key ) );

		// Now we replace values if needed.
		if ( is_array( $replace_values ) && $replace_values !== array() ) {
			foreach ( $replace_values as $old_value => $new_value ) {
				$this->wpdb->query( $this->wpdb->prepare( "UPDATE tmp_meta_table SET meta_value = %s WHERE meta_value = %s", $new_value, $old_value ) );
			}
		}

		// With everything done, we insert all our newly cloned lines into the postmeta table.
		$this->wpdb->query( "	INSERT INTO {$this->wpdb->postmeta} SELECT * FROM tmp_meta_table" );

		// Now we drop our temporary table.
		$this->wpdb->query( "	DROP TEMPORARY TABLE IF EXISTS tmp_meta_table" );
	}
}
