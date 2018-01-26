<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_Jetpack_SEO
 *
 * Class with functionality to import Yoast SEO settings from Jetpack Advanced SEO
 */
class WPSEO_Import_Jetpack_SEO implements WPSEO_External_Importer {
	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $db;

	/**
	 * WPSEO_Import_Jetpack_SEO constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->db = $wpdb;
	}

	/**
	 * Returns the plugin name.
	 *
	 * @return string
	 */
	public function plugin_name() {
		return 'Jetpack';
	}

	/**
	 * Removes the Jetpack SEO data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$status = new WPSEO_Import_Status( 'cleanup', false );
		$affected_rows = $this->db->query( "DELETE FROM $this->db->postmeta WHERE meta_key = 'advanced_seo_description'" );
		if ( $affected_rows > 0 ) {
			return $status;
		}

		$status->set_status( true );
		return $status;
	}

	/**
	 * Import Jetpack SEO meta values
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$status = new WPSEO_Import_Status( 'cleanup', false );
		$affected_rows = $this->db->query( "SELECT COUNT(*) FROM $this->db->postmeta WHERE meta_key = 'advanced_seo_description'" );
		if ( $affected_rows > 0 ) {
			WPSEO_Meta::replace_meta( 'advanced_seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
			$status->set_status( true );
			return $status;
		}

		return $status;
	}
}
