<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class with functionality to import Yoast SEO settings from Ultimate SEO.
 */
class WPSEO_Import_Ultimate_SEO implements WPSEO_External_Importer {
	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $db;

	/**
	 * WPSEO_Import_Ultimate_SEO constructor.
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
		return 'Ultimate SEO';
	}

	/**
	 * Imports the Ultimate SEO  meta values.
	 *
	 * @returns WPSEO_Import_Status
	 */
	public function import() {
		$status = new WPSEO_Import_Status( 'import', false );
		$affected_rows = $this->db->query( "SELECT COUNT(*) FROM $this->db->postmeta WHERE meta_key LIKE '_su_%'" );
		if ( $affected_rows === 0 ) {
			return $status;
		}

		WPSEO_Meta::replace_meta( '_su_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		WPSEO_Meta::replace_meta( '_su_meta_robots_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( '_su_meta_robots_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( '_su_og_title', WPSEO_Meta::$meta_prefix . 'opengraph-title', false );
		WPSEO_Meta::replace_meta( '_su_og_description', WPSEO_Meta::$meta_prefix . 'opengraph-description', false );
		WPSEO_Meta::replace_meta( '_su_og_image', WPSEO_Meta::$meta_prefix . 'opengraph-image', false );
		WPSEO_Meta::replace_meta( '_su_title', WPSEO_Meta::$meta_prefix . 'title', false );
		$status->set_status( true );

		return $status;
	}

	/**
	 * Removes all leftover SEO ultimate data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$status = new WPSEO_Import_Status( 'cleanup', false );
		$affected_rows = $this->db->query( "DELETE FROM {$this->db->prefix}postmeta WHERE meta_key LIKE '_su_%'" );
		if ( $affected_rows > 0 ) {
			$status->set_status( true );
			return $status;
		}

		return $status;
	}
}
