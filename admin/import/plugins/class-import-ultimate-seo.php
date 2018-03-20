<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class with functionality to import Yoast SEO settings from Ultimate SEO.
 */
class WPSEO_Import_Ultimate_SEO implements WPSEO_Plugin_Importer {
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
	 * WPSEO_Import_Ultimate_SEO constructor.
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
		return 'Ultimate SEO';
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
	 * Imports the Ultimate SEO  meta values.
	 *
	 * @returns WPSEO_Import_Status Import status object.
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );

		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		WPSEO_Meta::replace_meta( '_su_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		WPSEO_Meta::replace_meta( '_su_meta_robots_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( '_su_meta_robots_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( '_su_og_title', WPSEO_Meta::$meta_prefix . 'opengraph-title', false );
		WPSEO_Meta::replace_meta( '_su_og_description', WPSEO_Meta::$meta_prefix . 'opengraph-description', false );
		WPSEO_Meta::replace_meta( '_su_og_image', WPSEO_Meta::$meta_prefix . 'opengraph-image', false );
		WPSEO_Meta::replace_meta( '_su_title', WPSEO_Meta::$meta_prefix . 'title', false );

		return $this->status->set_status( true );
	}

	/**
	 * Removes all leftover SEO ultimate data from the database.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );

		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_su_%'" );

		return $this->status->set_status( true );
	}

	/**
	 * Detects whether there is post meta data to import.
	 *
	 * @return bool Boolean indicating whether there is something to import.
	 */
	private function detect_helper() {
		$result = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_su_%'" );
		if ( $result === '0' ) {
			return false;
		}

		return true;
	}
}
