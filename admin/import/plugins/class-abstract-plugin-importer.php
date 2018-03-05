<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Plugin_Importer
 *
 * Class with functionality to import Yoast SEO settings from other plugins.
 */
abstract class WPSEO_Plugin_Importer implements WPSEO_Plugin_Importer_Interface {
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
	public function plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Imports the settings and post meta data from another SEO plugin.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );

		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->import_helper();

		return $this->status->set_status( true );
	}

	/**
	 * Handles post meta data to import.
	 *
	 * @return void
	 */
	abstract protected function import_helper();

	/**
	 * Removes the plugin data from the database.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );

		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->cleanup_helper();

		return $this->status->set_status( true );
	}

	/**
	 * Removes the plugin data from the database.
	 *
	 * @return void
	 */
	protected function cleanup_helper() {
		$this->wpdb->query( $this->wpdb->prepare( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE %s", $this->meta_key ) );
	}

	/**
	 * Detects whether an import for this plugin is needed.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function detect() {
		$this->status = new WPSEO_Import_Status( 'detect', false );

		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return bool Boolean indicating whether there is something to import.
	 */
	protected function detect_helper() {
		$result = $this->wpdb->get_var( $this->wpdb->prepare( "SELECT COUNT(*) AS `count` FROM {$this->wpdb->postmeta} WHERE meta_key LIKE %s", $this->meta_key ) );
		if ( $result === '0' ) {
			return false;
		}

		return true;
	}
}