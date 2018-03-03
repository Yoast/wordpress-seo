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

		$this->status = new WPSEO_Import_Status( 'detect', false );
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
	 * Detect whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect() {
		$count = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '\_su\_%'" );
		if ( $count === '0' ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Imports the Ultimate SEO  meta values.
	 *
	 * @returns WPSEO_Import_Status
	 */
	public function import() {
		$this->status->set_action( 'import' );

		if ( ! $this->detect() ) {
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
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status->set_action( 'cleanup' );
		$affected_rows = $this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_su_%'" );
		if ( $affected_rows > 0 ) {
			return $this->status->set_status( true );
		}

		return $this->status;
	}
}
