<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_Jetpack_SEO
 *
 * Class with functionality to import Yoast SEO settings from Jetpack Advanced SEO.
 */
class WPSEO_Import_Jetpack_SEO implements WPSEO_Plugin_Importer {
	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $wpdb;

	/**
	 * Holds the import status object.
	 *
	 * @var WPSEO_Import_Status
	 */
	private $status;

	/**
	 * WPSEO_Import_Jetpack_SEO constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->wpdb = $wpdb;
	}

	/**
	 * Returns the plugin name.
	 *
	 * @return string Plugin name.
	 */
	public function plugin_name() {
		return 'Jetpack';
	}

	/**
	 * Detects whether there is post meta data to import.
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
	 * Removes the Jetpack SEO data from the database.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key = 'advanced_seo_description'" );
		return $this->status->set_status( true );
	}

	/**
	 * Imports Jetpack SEO meta values.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		WPSEO_Meta::replace_meta( 'advanced_seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		return $this->status->set_status( true );
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return bool Boolean indicating whether there is something to import.
	 */
	private function detect_helper() {
		$result = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key = 'advanced_seo_description'" );
		if ( $result === '0' ) {
			return false;
		}

		return true;
	}
}
